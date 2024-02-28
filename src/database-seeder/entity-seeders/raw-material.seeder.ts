import { DeepPartial, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseSeeder } from '../base-seeder';
import { RawMaterial } from 'src/database/entities/raw-material.entity';
import { SeedUtils } from '../seed-utils';

@Injectable()
export class RawMaterialSeeder extends BaseSeeder<RawMaterial> {
  constructor(
    @InjectRepository(RawMaterial)
    private readonly rawMaterialRepo: Repository<RawMaterial>,
  ) {
    super(rawMaterialRepo);
  }
  generate(index: number): DeepPartial<RawMaterial> {
    return {
      amount: SeedUtils.randomIntFromInterval(10, 100) * 1000,
      cost: SeedUtils.randomIntFromInterval(1, 10) * 1000,
      name: `raw_material_${index}`,
    };
  }
}
