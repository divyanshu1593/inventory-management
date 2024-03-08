import {
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSalesDto } from './dto/create-sales.dto';
import { LessThanOrEqual, DataSource, type Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductSale } from 'src/database/entities/product-sale.entity';
import { UUID } from 'crypto';
import { tryWith } from 'src/database/error-handling/error-handler.adapter';
import { EntityNotFoundHandler } from 'src/database/error-handling/handlers/entity-not-found.handler';
import { Product } from 'src/database/entities/product.entity';

@Injectable()
export class SalesService {
  constructor(
    @Inject(DataSource) private readonly dataSource: DataSource,

    @InjectRepository(ProductSale)
    private readonly salesRepo: Repository<ProductSale>,
  ) {}

  async createSale(createSalesDto: CreateSalesDto) {
    const { product_id, count, to, total_cost } = createSalesDto;

    return await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        const sale = transactionalEntityManager.create(ProductSale, {
          product: { id: product_id },
          count,
          to,
          total_cost,
        });
        const result = await transactionalEntityManager.save(sale);

        const affected = await transactionalEntityManager
          .createQueryBuilder()
          .update(Product)
          .where({ id: product_id })
          .andWhere('amount - :count > 0')
          .set({ amount: () => 'amount - :count' })
          .setParameter('count', count)
          .execute();

        if (affected.affected == 0) {
          throw new NotAcceptableException('Not Enough Product Available');
        }

        return result;
      },
    );
  }

  async getSales() {
    const products = await this.salesRepo.find({
      relations: ['product'],
      order: { date: 'DESC' },
    });
    return products;
  }

  async getSaleById(productId: UUID) {
    return await tryWith(
      this.salesRepo.findOneOrFail({
        relations: ['product'],
        where: { id: productId },
      }),
    )
      .onError(
        EntityNotFoundHandler,
        () => new NotFoundException('Sale with given ID not found'),
      )
      .execute();
  }

  async getSalesByTotalCost(totalCost: number) {
    const products = await this.salesRepo.find({
      relations: ['product'],
      where: { total_cost: LessThanOrEqual(totalCost) },
      order: { date: 'DESC' },
    });
    return products;
  }
}
