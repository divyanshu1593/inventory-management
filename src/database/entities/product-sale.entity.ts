import { UUID } from 'crypto';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductSale {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @ManyToOne(() => Product)
  @JoinColumn()
  product: Product;

  @Column()
  count: number;

  @Column()
  to: string;

  @Column()
  total_cost: number;
}
