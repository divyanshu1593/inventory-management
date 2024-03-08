import { DeepPartial, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseSeeder } from '../base-seeder';
import { SeedUtils } from '../seed-utils';
import { Machine } from 'src/database/entities/machine.entity';
import { RawMaterial } from 'src/database/entities/raw-material.entity';
import { Product } from 'src/database/entities/product.entity';

@Injectable()
export class MachineSeeder extends BaseSeeder<Machine> {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepo: Repository<Machine>,

    @InjectRepository(RawMaterial)
    private readonly rawMaterialRepo: Repository<RawMaterial>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {
    super(machineRepo);
  }

  async getRandomRawMaterials(): Promise<RawMaterial[]> {
    const count = SeedUtils.randomIntFromInterval(1, 6);
    return await SeedUtils.getRandomEntriesFromRepo(
      this.rawMaterialRepo,
      count,
    );
  }

  async generate(index: number): Promise<DeepPartial<Machine>[]> {
    const randomCount = SeedUtils.randomIntFromInterval(1, 10);
    const randomProduct = await SeedUtils.getRandomEntryFromRepo(
      this.productRepo,
    );

    return [
      {
        consumes: await this.getRandomRawMaterials(),
        name: `machine_${index}`,
        count: randomCount,
        makes: randomProduct,
      },
    ];
  }
}
