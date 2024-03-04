import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UUID } from 'crypto';
import { RawMaterial } from './raw-material.entity';

@Entity()
export class RawMaterialImport {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @ManyToOne(() => RawMaterial, { nullable: false })
  raw_material: RawMaterial;

  @Column()
  count: number;

  @CreateDateColumn()
  date: Date;

  @Column()
  total_cost: number;
}
