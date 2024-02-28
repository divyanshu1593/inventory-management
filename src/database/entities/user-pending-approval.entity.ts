import { UUID } from 'crypto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './user.roles';

@Entity()
export class UserPendingApproval {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ unique: true })
  email: string;

  @Column()
  address: string;

  @Column()
  name: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'simple-enum' })
  role: UserRole;
}
