import { DeepPartial, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseSeeder } from '../base-seeder';
import { SeedUtils } from '../seed-utils';
import { RawMaterialImport } from 'src/database/entities/raw-material-import.entity';
import { RawMaterial } from 'src/database/entities/raw-material.entity';

@Injectable()
export class RawMaterialImportSeeder extends BaseSeeder<RawMaterialImport> {
  constructor(
    @InjectRepository(RawMaterial)
    private readonly rawMaterialRepo: Repository<RawMaterial>,

    @InjectRepository(RawMaterialImport)
    private readonly rawMaterialImportRepo: Repository<RawMaterialImport>,
  ) {
    super(rawMaterialImportRepo);
  }
  async generate(index: number): Promise<DeepPartial<RawMaterialImport>[]> {
    const count = SeedUtils.randomIntFromInterval(1, 10) * 1000;
    const rawMaterial = await SeedUtils.getRandomEntryFromRepo(
      this.rawMaterialRepo,
    );
    return [
      {
        count: count,
        raw_material: rawMaterial,
        total_cost: count * rawMaterial.cost,
      },
    ];
  }
}
