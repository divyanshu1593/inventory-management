import { UUID } from 'crypto';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RawMaterial } from './raw-material.entity';
import { Product } from './product.entity';

@Entity()
export class Machine {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => RawMaterial, (raw_material) => raw_material.consumed_by, {
    nullable: false,
  })
  @JoinTable()
  consumes: RawMaterial[];

  @ManyToOne(() => Product, { nullable: false })
  makes: Product;
}
