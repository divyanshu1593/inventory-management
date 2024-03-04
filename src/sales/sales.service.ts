import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSalesDto } from './dto/create-sales.dto';
import { EntityNotFoundError, LessThanOrEqual, type Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/database/entities/product.entity';
import { ProductSale } from 'src/database/entities/product-sale.entity';
import { UUID } from 'crypto';
import { tryWith } from 'src/database/error-handling/error-handler.adapter';
import { NotFoundError } from 'rxjs';
import { EntityNotFoundHandler } from 'src/database/error-handling/handlers/entity-not-found.handler';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(ProductSale)
    private readonly salesRepo: Repository<ProductSale>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async createSale(createSalesDto: CreateSalesDto) {
    const { model, name, variant, count, to, total_cost } = createSalesDto;

    //get product
    // TODO: use ID to link to product in database directly
    const product = await tryWith(
      this.productRepo.findOneOrFail({
        where: {
          name: name,
          model: model,
          variant: variant,
        },
      }),
    )
      .onError(
        EntityNotFoundHandler,
        () => new NotFoundException('Product with given ID not found'),
      )
      .execute();

    //create sale
    const countedCost = total_cost ?? product.price * count;
    const sale = this.salesRepo.create({
      product: product,
      count,
      to,
      total_cost: countedCost,
    });
    return await this.salesRepo.save(sale);
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
