import { CanActivate, ExecutionContext, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { applyDecorators } from '@nestjs/common';
import { UserRole } from 'src/database/entities/user.roles';

class RoleGuard implements CanActivate {
  constructor(private readonly roles: UserRole[]) {}
  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();

    const request: Request = ctx.getRequest<Request>();

    return this.roles.includes(request.user.role);
  }
}

export function AllowRoles(...roles: UserRole[]) {
  return applyDecorators(UseGuards(new RoleGuard(roles)));
}
