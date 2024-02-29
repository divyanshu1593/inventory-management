import { UserRole } from 'src/database/entities/user.roles';

export type JwtPayload = {
  iat?: number;
  name: string;
  role: UserRole;
};
