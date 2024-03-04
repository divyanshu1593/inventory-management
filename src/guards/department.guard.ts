import { CanActivate, ExecutionContext, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { applyDecorators } from '@nestjs/common';
import { CompanyDepartment } from 'src/database/entities/company-departments';
import { UserRole } from 'src/database/entities/user.roles';

class DepartmentGuard implements CanActivate {
  constructor(private readonly department: CompanyDepartment) {}
  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();

    const request: Request = ctx.getRequest<Request>();

    return (
      request.user.role === UserRole.ADMIN ||
      this.department === request.user.department
    );
  }
}

export function AllowDept(department: CompanyDepartment) {
  return applyDecorators(UseGuards(new DepartmentGuard(department)));
}
