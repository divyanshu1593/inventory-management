import { Injectable } from '@nestjs/common';
import { CreateSalesDto } from './dto/create-sales.dto';
import type { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/database/entities/product.entity';
import { ProductSale } from 'src/database/entities/product-sale.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(ProductSale)
    private readonly salesRepo: Repository<ProductSale>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async createSale(
    createSalesDto: CreateSalesDto,
  ): Promise<{ message: string }> {
    const { model, name, variant, count, to } = createSalesDto;

    //get product
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
  }

  async getSales(): Promise<{ data: ProductSale[] }> {
    const product: ProductSale[] = await this.salesRepo
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.product', 'product')
      .orderBy('sale.date', 'DESC')
      .getMany();
    return { data: product };
  }

  async getSalesById(productId: string): Promise<{ data: ProductSale[] }> {
    const product: ProductSale[] = await this.salesRepo
      .createQueryBuilder('sale')
      .leftJoin('sale.product', 'product')
      .where('sale.id = :id', {
        id: productId,
      })
      .select(['sale', 'product'])
      .getMany();
    return { data: product };
  }

  async getSalesByTotalCost(
    totalCost: number,
  ): Promise<{ data: ProductSale[] }> {
    const product: ProductSale[] = await this.salesRepo
      .createQueryBuilder('sale')
      .leftJoin('sale.product', 'product')
      .where('sale.total_cost <= :cost', {
        cost: totalCost,
      })
      .select(['sale', 'product'])
      .getMany();
    return { data: product };
  }
}
