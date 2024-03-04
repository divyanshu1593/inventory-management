import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { Machine } from './machine.entity';

@Entity()
export class MachineImport {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @ManyToOne(() => Machine)
  machine: Machine;

  @Column()
  count: number;

  @CreateDateColumn()
  date: Date;

  @Column()
  total_cost: number;
}