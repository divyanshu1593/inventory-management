import type { UserRole } from 'src/database/entities/user.roles';

export type SignableJwtPayload = {
  id: string;
  role: UserRole;
};

export type JwtPayload = SignableJwtPayload & {
  iat: number;
};
