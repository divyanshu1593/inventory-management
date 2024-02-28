import { Injectable } from '@nestjs/common';
import { UserSignupDto } from './dto/user-signup.dto';
import * as bcrypt from 'bcrypt';
import { UserPendingApproval } from 'src/database/entities/user-pending-approval.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserPendingApproval)
    private readonly userPendingApprovalRepo: Repository<UserPendingApproval>,
  ) {}

  async addUnapprovedUser(userInfo: UserSignupDto) {
    const { password, ...userInfoWithoutPassword } = userInfo;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await this.userPendingApprovalRepo.insert({
      ...userInfoWithoutPassword,
      passwordHash,
    });
  }
}
