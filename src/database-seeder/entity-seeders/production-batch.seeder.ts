import { Injectable } from '@nestjs/common';
import { BaseSeeder } from '../base-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { SeedUtils } from '../seed-utils';
import { ProductionBatch } from 'src/database/entities/production-batch.entity';
import { Product } from 'src/database/entities/product.entity';

@Injectable()
export class ProductionBatchSeeder extends BaseSeeder<ProductionBatch> {
  constructor(
    @InjectRepository(ProductionBatch)
    private readonly productionBatchRepo: Repository<ProductionBatch>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<ProductionBatch>,
  ) {
    super(productionBatchRepo);
  }

  async generate(_index: number): Promise<DeepPartial<ProductionBatch>[]> {
    const randomAmount = SeedUtils.randomIntFromInterval(10, 100);
    return [
      {
        product: await SeedUtils.getRandomEntryFromRepo(this.productRepo),
        amount: randomAmount,
      },
    ];
  }
}
