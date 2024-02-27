import { UUID } from 'crypto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ProductCategory } from './product.category';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ type: 'simple-enum' })
  category: ProductCategory;

  @Column()
  model: string;

  @Column()
  variant: string;

  @Column()
  amount: number;
}
