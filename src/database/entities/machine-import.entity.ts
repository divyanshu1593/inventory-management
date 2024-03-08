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

  @ManyToOne(() => Machine, { nullable: false })
  machine: Machine;

  @Column()
  count: number;

  @CreateDateColumn()
  date: Date;

  @Column({ type: 'real' })
  total_cost: number;
}
