import { UUID } from 'crypto';
import {
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

  @ManyToOne(() => Product, { nullable: false })
  product: Product;
}
