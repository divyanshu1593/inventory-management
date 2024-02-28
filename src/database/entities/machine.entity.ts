import { UUID } from 'crypto';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RawMaterial } from './raw-material.entity';

@Entity()
export class Machine {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => RawMaterial, (raw_material) => raw_material.consumed_by)
  @JoinTable()
  consumes: RawMaterial[];
}
