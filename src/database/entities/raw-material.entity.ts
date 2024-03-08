import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UUID } from 'crypto';
import { Machine } from './machine.entity';

@Entity()
export class RawMaterial {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'real' })
  cost: number;

  @Column()
  amount: number;

  @ManyToMany(() => Machine, (machine) => machine.consumes, { nullable: true })
  consumed_by: Machine[];
}
