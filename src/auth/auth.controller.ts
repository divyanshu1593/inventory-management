import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common';
import { UserSignupDto } from './dto/user-signup.dto';
import { AuthService } from './auth.service';
import { JwtPayload } from './types/jwtPayload.type';
import { userEmailArrayDto } from './dto/user-email-array.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup/')
  async addUnapprovedUser(@Body() userInfo: UserSignupDto) {
    return await this.authService.addUnapprovedUser(userInfo);
  }

  // TODO: add appropriate Roles decorator
  @Get('signup/get-approvable-requests')
  async getApprovableRequests(
    @Req() req: Request & { user: { jwtPayload: JwtPayload } },
  ) {
    return await this.authService.getApprovalbleRequests(
      req.user.jwtPayload.role,
    );
  }

  // TODO: add appropriate Roles decorator
  @Put('signup/approve-requests')
  async approveRequests(
    @Req() req: Request & { user: { jwtPayload: JwtPayload } },
    @Body() userEmailArray: userEmailArrayDto,
  ) {
    return await this.authService.approveRequests(
      req.user.jwtPayload.role,
      userEmailArray.emails,
    );
  }
}
