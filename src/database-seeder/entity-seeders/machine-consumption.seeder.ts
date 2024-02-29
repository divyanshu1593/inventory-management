import { Injectable } from '@nestjs/common';
import { BaseSeeder } from '../base-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { SeedUtils } from '../seed-utils';
import { MachineConsumption } from 'src/database/entities/machine-consumption.entity';
import { Machine } from 'src/database/entities/machine.entity';
import { ProductionBatch } from 'src/database/entities/production-batch.entity';

@Injectable()
export class MachineConsumptionSeeder extends BaseSeeder<MachineConsumption> {
  constructor(
    @InjectRepository(MachineConsumption)
    private readonly machineConsumptionRepo: Repository<MachineConsumption>,

    @InjectRepository(Machine)
    private readonly machineRepo: Repository<Machine>,

    @InjectRepository(ProductionBatch)
    private readonly batchRepo: Repository<ProductionBatch>,
  ) {
    super(machineConsumptionRepo);
  }

  async generate(_index: number): Promise<DeepPartial<MachineConsumption>[]> {
    const batch = await SeedUtils.getRandomEntryFromRepo(this.batchRepo);
    const machine = await SeedUtils.getRandomEntryFromRepo(this.machineRepo, {
      relations: { consumes: true },
    });
    // only use the raw material that the machine is able to consume
    const rawMaterial = SeedUtils.selectRandomFromArray(machine.consumes);
    return [
      {
        batch: batch,
        machine: machine,
        raw_material_count: SeedUtils.randomIntFromInterval(100, 200),
        raw_material: rawMaterial,
      },
    ];
  }
}
