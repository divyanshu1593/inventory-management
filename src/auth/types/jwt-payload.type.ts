import type { UserRole } from 'src/database/entities/user.roles';

export type JwtPayload = {
  iat?: number;
  id: string;
  role: UserRole;
};
