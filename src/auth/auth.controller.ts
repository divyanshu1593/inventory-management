import { Body, Controller, Post } from '@nestjs/common';
import { UserSignupDto } from './dto/user-signup.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup/add-unapproved-user')
  async addUnapprovedUser(@Body() userInfo: UserSignupDto) {
    return await this.authService.addUnapprovedUser(userInfo);
  }
}
