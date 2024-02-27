import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UUID } from 'crypto';
import { RawMaterial } from './raw-material.entity';

@Entity()
export class RawMaterialImport {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @ManyToOne(() => RawMaterial)
  raw_material: RawMaterial;

  @Column()
  count: number;

  @Column()
  date: Date;

  @Column()
  total_cost: number;
}
