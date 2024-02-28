import { DeepPartial, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseSeeder } from '../base-seeder';
import { SeedUtils } from '../seed-utils';
import { Machine } from 'src/database/entities/machine.entity';
import { RawMaterial } from 'src/database/entities/raw-material.entity';

@Injectable()
export class MachineSeeder extends BaseSeeder<Machine> {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepo: Repository<Machine>,

    @InjectRepository(RawMaterial)
    private readonly rawMaterialRepo: Repository<RawMaterial>,
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
    return [
      {
        consumes: await this.getRandomRawMaterials(),
        name: `machine_${index}`,
      },
    ];
  }
}
