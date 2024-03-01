import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/database/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User Not found in Database or not Approved');
    }
    const matched: boolean = await bcrypt.compare(password, user.passwordHash);

    if (!matched) {
      throw new UnauthorizedException('Please check your login criteria');
    }

    return user;
  }
}
