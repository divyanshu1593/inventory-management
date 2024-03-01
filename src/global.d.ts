import type { JwtPayload } from './auth/types/jwt-payload.type';

declare global {
  namespace Express {
    interface User {
      id: string;
      role: UserRole;
      jwtPayload: JwtPayload;
    }
  }
}

export {};
