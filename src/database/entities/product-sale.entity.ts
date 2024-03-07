import { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
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

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn()
  product: Product;

  @Column()
  count: number;

  @Column()
  to: string;

  @Column({ type: 'real' })
  total_cost: number;

  @CreateDateColumn()
  date: Date;
}
