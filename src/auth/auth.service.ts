import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(payload: object) {
    const token: string = this.jwtService.sign(payload);
    console.log(token);

    return { token };
  }
}
