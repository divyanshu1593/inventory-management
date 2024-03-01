import { CanActivate, ExecutionContext, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { applyDecorators } from '@nestjs/common';
import { CompanyDepartment } from 'src/database/entities/company-departments';

class DepartmentGuard implements CanActivate {
  constructor(private readonly department: CompanyDepartment) {}
  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();

    const request: Request = ctx.getRequest<Request>();

    return this.department === request.user.department;
  }
}

export function AllowDept(department: CompanyDepartment) {
  return applyDecorators(UseGuards(new DepartmentGuard(department)));
}
