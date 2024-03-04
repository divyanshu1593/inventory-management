import { CompanyDepartment } from 'src/database/entities/company-departments';
import type { UserRole } from 'src/database/entities/user.roles';

export type SignableJwtPayload = {
  id: string;
  role: UserRole;
  department: CompanyDepartment;
};

export type JwtPayload = SignableJwtPayload & {
  iat: number;
};
