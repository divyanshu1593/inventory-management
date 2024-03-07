import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Put,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AllowUnauthorized } from 'src/guards/allow-unauthorized';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { UserSignupDto } from './dto/user-signup.dto';
import { AuthService } from './auth.service';
import { userEmailArrayDto } from './dto/user-email-array.dto';
import { AllowAllRoles, AllowRoles } from 'src/guards/roles.guard';
import { UserRole } from 'src/database/entities/user.roles';
import { JWT_COOKIE_KEY } from './jwt.strategy';
import { AllowAllDept } from 'src/guards/department.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowUnauthorized()
  @Post('signup')
  async addUnapprovedUser(@Body() userInfo: UserSignupDto) {
    return await this.authService.addUnapprovedUser(userInfo);
  }

  @AllowRoles(UserRole.ADMIN, UserRole.DEPARTMENT_HEAD, UserRole.MANAGER)
  @AllowAllDept()
  @Get('signup/get-approvable-requests')
  async getApprovableRequests(@Req() req: Request) {
    return await this.authService.getApprovableRequests(
      req.user.role,
      req.user.department,
    );
  }

  @AllowRoles(UserRole.ADMIN, UserRole.DEPARTMENT_HEAD, UserRole.MANAGER)
  @AllowAllDept()
  @Put('signup/approve-requests')
  async approveRequests(
    @Req() req: Request,
    @Body() userEmailArray: userEmailArrayDto,
  ) {
    return await this.authService.approveRequests(
      req.user.role,
      req.user.department,
      userEmailArray.emails,
    );
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  @AllowUnauthorized()
  signin(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const jwt = this.authService.login({
      id: req.user.id,
      role: req.user.role,
      department: req.user.department,
    });

    res.cookie(JWT_COOKIE_KEY, jwt.token, { httpOnly: true });
    return req.user;
  }

  @Post('signout')
  @AllowAllDept()
  @AllowAllRoles()
  signout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(JWT_COOKIE_KEY);
    return {};
  }
}
