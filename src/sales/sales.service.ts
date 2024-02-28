import { Injectable } from '@nestjs/common';
import { CreateSalesDto } from './dto/create-sales.dto';
import type { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/database/entities/product.entity';
import type { CreateProductDto } from './dto/create-product.dto';
import { ProductSale } from 'src/database/entities/product-sale.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(ProductSale)
    private readonly salesRepo: Repository<ProductSale>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async craeteProduct(craeteProductDto: CreateProductDto) {
    try {
      await this.productRepo
        .createQueryBuilder()
        .insert()
        .into(Product)
        .values(craeteProductDto)
        .execute();
      return { message: 'product added successfully' };
    } catch (error) {
      throw new Error(error);
    }
  }

  async createSales(createSalesDto: CreateSalesDto) {
    const { model, name, variant, count, to } = createSalesDto;

    //get product
    try {
      const product = await this.productRepo
        .createQueryBuilder('product')
        .where(
          'product.name = :name AND product.model=:model AND product.variant = :variant',
          { name, model, variant },
        )
        .getOneOrFail();

      //create sale
      await this.salesRepo
        .createQueryBuilder()
        .insert()
        .into(ProductSale)
        .values({
          product: product,
          count,
          to,
          total_cost: product.price * count,
        })
        .execute();
      return { message: 'sale added successfully' };
    } catch (error) {
      throw new Error(error);
    }
  }
}
