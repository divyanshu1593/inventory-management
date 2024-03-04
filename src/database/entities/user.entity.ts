import { UUID } from 'crypto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './user.roles';
import { CompanyDepartment } from './company-departments';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ unique: true })
  email: string;

  @Column()
  address: string;

  @Column()
  name: string;

  @Exclude()
  @Column()
  passwordHash: string;

  @Column()
  is_approved: boolean;

  @Column({ type: 'simple-enum' })
  role: UserRole;

  @Column({ type: 'simple-enum' })
  department: CompanyDepartment;
}
