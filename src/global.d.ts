import type { JwtPayload } from './auth/types/jwt-payload.type';
import { CompanyDepartment } from './database/entities/company-departments';

declare global {
  interface Array<T> {
    getFirstOrFail(): T;
  }
  namespace Express {
    interface User {
      id: string;
      role: UserRole;
      department: CompanyDepartment;
    }
  }
}

export {};
