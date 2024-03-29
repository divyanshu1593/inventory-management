import {
  CanActivate,
  ExecutionContext,
  Injectable,
  applyDecorators,
} from '@nestjs/common';
import { Request } from 'express';
import { CompanyDepartment } from 'src/database/entities/company-departments';
import { UserRole } from 'src/database/entities/user.roles';
import { Reflector } from '@nestjs/core';
import { ALLOW_UNAUTHORIZED_KEY } from './allow-unauthorized';

@Injectable()
export class DepartmentGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    if (this.reflector.get(ALLOW_UNAUTHORIZED_KEY, context.getHandler())) {
      return true;
    }

    const ctx = context.switchToHttp();

    const departments = this.reflector.getAllAndOverride(DeptGuardReflector, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request: Request = ctx.getRequest<Request>();

    if (request.user.role === UserRole.ADMIN) {
      return true;
    }

    return departments.includes(request.user.department);
  }
}

const DeptGuardReflector = Reflector.createDecorator<CompanyDepartment[]>();

export function AllowDept(...departments: CompanyDepartment[]) {
  return applyDecorators(DeptGuardReflector(departments));
}

export const AllowAllDept = () => {
  const allDept = Object.values(CompanyDepartment);
  return applyDecorators(AllowDept(...allDept));
};
