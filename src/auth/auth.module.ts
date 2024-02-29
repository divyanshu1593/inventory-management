import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthorityMap } from './authority-maping';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthorityMap],
})
export class AuthModule {}
