import { UserRole } from 'src/database/entities/user.roles';

// "person in key" IS HEAD OF "person in value"
export const AuthorityMap = new Map([
  [UserRole.OPERATOR, null],
  [UserRole.MANAGER, UserRole.OPERATOR],
  [UserRole.DEPARTMENT_HEAD, UserRole.MANAGER],
]);
