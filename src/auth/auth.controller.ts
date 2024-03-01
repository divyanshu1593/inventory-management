import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Put,
} from '@nestjs/common';
import { Request } from 'express';
import { AllowUnauthorized } from 'src/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { UserSignupDto } from './dto/user-signup.dto';
import { AuthService } from './auth.service';
import { JwtPayload } from './types/jwt-payload.type';
import { userEmailArrayDto } from './dto/user-email-array.dto';
import { AllowRoles } from 'src/guards/roles.guard';
import { UserRole } from 'src/database/entities/user.roles';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowUnauthorized()
  @Post('signup/')
  async addUnapprovedUser(@Body() userInfo: UserSignupDto) {
    return await this.authService.addUnapprovedUser(userInfo);
  }

  @AllowRoles(UserRole.ADMIN, UserRole.DEPARTMENT_HEAD, UserRole.MANAGER)
  @Get('signup/get-approvable-requests')
  async getApprovableRequests(@Req() req: Request) {
    return await this.authService.getApprovalbleRequests(
      req.user.jwtPayload.role,
    );
  }

  @AllowRoles(UserRole.ADMIN, UserRole.DEPARTMENT_HEAD, UserRole.MANAGER)
  @Put('signup/approve-requests')
  async approveRequests(
    @Req() req: Request,
    @Body() userEmailArray: userEmailArrayDto,
  ) {
    return await this.authService.approveRequests(
      req.user.jwtPayload.role,
      userEmailArray.emails,
    );
  }

  @Post('signin/')
  @UseGuards(LocalAuthGuard)
  @AllowUnauthorized()
  login(@Req() req: Request) {
    const payload: JwtPayload = {
      id: req.user.id,
      role: req.user.role,
    };
    return this.authService.login(payload);
  }
}
