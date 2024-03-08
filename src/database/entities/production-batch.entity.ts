import { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductionBatch {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @CreateDateColumn()
  date: Date;

  @Column()
  amount: number;

  @ManyToOne(() => Product, { nullable: false })
  product: Product;
}
