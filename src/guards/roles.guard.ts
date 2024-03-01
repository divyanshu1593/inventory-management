import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export class RoleGuard implements CanActivate {
  private roles: string[];

  constructor(...roles: string[]) {
    this.roles = roles;
  } //
  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();

    const request: Request = ctx.getRequest<Request>();

    return this.roles.includes(request.user.jwtPayload.role);
  }
}
