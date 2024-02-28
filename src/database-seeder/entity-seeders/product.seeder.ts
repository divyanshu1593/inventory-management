import { DeepPartial, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseSeeder } from '../base-seeder';
import { SeedUtils } from '../seed-utils';
import { Product } from 'src/database/entities/product.entity';
import { ProductCategory } from 'src/database/entities/product.category';

@Injectable()
export class ProductSeeder extends BaseSeeder<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {
    super(productRepo);
  }

  generateProduct(index: number) {
    const randomVariants = ['6/64', '6/128', '8/126', '12/256'];
    const randomModels = [1, 2, 3];
    const category = SeedUtils.randomEnum(ProductCategory);
    const xProduct = SeedUtils.xProd(randomModels, randomVariants);

    return xProduct.map(([model, variant]) => {
      return {
        amount: SeedUtils.randomIntFromInterval(10, 100) * 1000,
        name: `product_name_${index}`,
        category: category,
        model: `product_model_${model}`,
        price: SeedUtils.randomIntFromInterval(1, 10) * 1000,
        variant: `product_variant_${variant}`,
      };
    });
  }

  async generate(index: number): Promise<DeepPartial<Product>[]> {
    return this.generateProduct(index);
  }
}
