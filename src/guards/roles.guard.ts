import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { applyDecorators } from '@nestjs/common';
import { UserRole } from 'src/database/entities/user.roles';
import { Reflector } from '@nestjs/core';
import { ALLOW_UNAUTHORIZED_KEY } from './allow-unauthorized';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    if (this.reflector.get(ALLOW_UNAUTHORIZED_KEY, context.getHandler())) {
      return true;
    }

    const ctx = context.switchToHttp();
    const request: Request = ctx.getRequest<Request>();

    if (request.user.role === UserRole.ADMIN) {
      return true;
    }

    const roles = this.reflector.getAllAndOverride(AllowRolesReflector, [
      context.getHandler(),
      context.getClass(),
    ]);

    return roles.includes(request.user.role);
  }
}

const AllowRolesReflector = Reflector.createDecorator<UserRole[]>();

export function AllowRoles(...roles: UserRole[]) {
  return applyDecorators(AllowRolesReflector(roles));
}
