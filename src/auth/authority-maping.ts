import { Injectable } from '@nestjs/common';
import { UserRole } from 'src/database/entities/user.roles';

// "person in key" IS HEAD OF "person in value"
@Injectable()
export class AuthorityMap {
  info = new Map([
    [UserRole.OPERATOR, null],
    [UserRole.MANAGER, UserRole.OPERATOR],
    [UserRole.DEPARTMENT_HEAD, UserRole.MANAGER],
    [UserRole.ADMIN, UserRole.DEPARTMENT_HEAD],
  ]);
}
