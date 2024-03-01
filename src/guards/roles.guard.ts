import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export class RoleGuard implements CanActivate {
  private role: string;

  constructor(role: string) {
    this.role = role;
  } //
  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();

    const request: Request = ctx.getRequest<Request>();

    return this.role == request.user.jwtPayload.role;
  }
}
