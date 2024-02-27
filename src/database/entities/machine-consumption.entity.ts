import { UUID } from 'crypto';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductionBatch } from './production-batch.entity';
import { Machine } from './machine.entity';
import { RawMaterial } from './raw-material.entity';

@Entity()
export class MachineConsumption {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @ManyToOne(() => ProductionBatch)
  batch: ProductionBatch;

  // TODO: this many to One Realtionship does not enforce
  // database level check for "which machine can consume which raw material"
  @ManyToOne(() => Machine)
  machine: Machine;

  @ManyToOne(() => RawMaterial)
  raw_material: RawMaterial;

  @Column()
  raw_material_count: number;
}
