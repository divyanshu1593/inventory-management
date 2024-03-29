import { UUID } from 'crypto';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ProductCategory } from './product.category';

@Entity()
@Unique(['name', 'model', 'variant'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column()
  name: string;

  @Column({ type: 'real' })
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
