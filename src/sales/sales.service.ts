import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSalesDto } from './dto/create-sales.dto';
import { LessThanOrEqual, type Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductSale } from 'src/database/entities/product-sale.entity';
import { UUID } from 'crypto';
import { tryWith } from 'src/database/error-handling/error-handler.adapter';
import { EntityNotFoundHandler } from 'src/database/error-handling/handlers/entity-not-found.handler';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(ProductSale)
    private readonly salesRepo: Repository<ProductSale>,
  ) {}

  async createSale(createSalesDto: CreateSalesDto) {
    const { product_id, count, to, total_cost } = createSalesDto;

    const sale = this.salesRepo.create({
      product: { id: product_id },
      count,
      to,
      total_cost,
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
