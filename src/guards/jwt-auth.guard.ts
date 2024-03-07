import { Injectable, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import type { Observable } from 'rxjs';
import { ALLOW_UNAUTHORIZED_KEY } from './allow-unauthorized';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (this.reflector.get(ALLOW_UNAUTHORIZED_KEY, context.getHandler())) {
      return true;
    }
    return super.canActivate(context);
  }
}
