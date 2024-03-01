import { Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request } from 'express';
import { AllowUnauthorized } from 'src/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('signin/')
  @UseGuards(LocalAuthGuard)
  @AllowUnauthorized()
  login(@Req() req: Request) {
    const payload = {
      id: req.user.id,
      role: req.user.role,
    };
    return this.authService.login(payload);
  }
}
