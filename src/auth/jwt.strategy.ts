import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AppConfigService } from 'src/config/config.service';
import type { JwtPayload } from './types/jwt-payload.type';
import { Request } from 'express';

export const JWT_COOKIE_KEY = 'jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AppConfigService)
    private readonly appConfigService: AppConfigService,
  ) {
    super({
      jwtFromRequest: JwtStrategy.extractJWT,
      secretOrKey: appConfigService.get('JWT_SECRET_KEY'),
    });
  }

  private static extractJWT(req: Request): string | null {
    return req?.cookies?.[JWT_COOKIE_KEY];
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
