import { MachineImport } from 'src/database/entities/machine-import.entity';
import { BaseSeeder } from '../base-seeder';
import { DeepPartial, Repository } from 'typeorm';
import { SeedUtils } from '../seed-utils';
import { Injectable } from '@nestjs/common';
import { Machine } from 'src/database/entities/machine.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MachineImportSeeder extends BaseSeeder<MachineImport> {
  constructor(
    @InjectRepository(MachineImport)
    private readonly machineImportRepo: Repository<MachineImport>,

    @InjectRepository(Machine)
    private readonly machineRepo: Repository<Machine>,
  ) {
    super(machineImportRepo);
  }

  async generate(_index: number): Promise<DeepPartial<MachineImport>[]> {
    const count = SeedUtils.randomIntFromInterval(1, 10);
    const singleCost = SeedUtils.randomIntFromInterval(1, 10) * 1000;
    return [
      {
        count: count,
        machine: await SeedUtils.getRandomEntryFromRepo(this.machineRepo),
        total_cost: count * singleCost,
      },
    ];
  }
}
