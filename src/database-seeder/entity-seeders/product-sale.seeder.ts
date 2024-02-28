import { DeepPartial, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseSeeder } from '../base-seeder';
import { SeedUtils } from '../seed-utils';
import { ProductSale } from 'src/database/entities/product-sale.entity';
import { Product } from 'src/database/entities/product.entity';

@Injectable()
export class ProductSaleSeeder extends BaseSeeder<ProductSale> {
  constructor(
    @InjectRepository(ProductSale)
    private readonly productSaleRepo: Repository<ProductSale>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {
    super(productSaleRepo);
  }

  async generate(index: number): Promise<DeepPartial<ProductSale>[]> {
    const count = SeedUtils.randomIntFromInterval(100, 700);
    const product = await SeedUtils.getRandomEntryFromRepo(this.productRepo);
    return [
      {
        count: count,
        date: new Date(),
        product: product,
        total_cost: product.price * count,
        to: `sale_to_${index}`,
      },
    ];
  }
}
