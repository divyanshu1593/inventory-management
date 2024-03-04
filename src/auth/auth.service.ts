import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserSignupDto } from './dto/user-signup.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserRole } from 'src/database/entities/user.roles';
import { User } from 'src/database/entities/user.entity';
import { AuthorityMap } from './authority-maping';
import { SignableJwtPayload } from './types/jwt-payload.type';
import { CompanyDepartment } from 'src/database/entities/company-departments';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async addUnapprovedUser(userInfo: UserSignupDto) {
    const { password, ...userInfoWithoutPassword } = userInfo;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await this.userRepo.insert({
      ...userInfoWithoutPassword,
      is_approved: false,
      passwordHash,
    });
  }

  async getApprovableRequests(role: UserRole, department: CompanyDepartment) {
    const juniorRole = AuthorityMap.get(role);
    if (juniorRole === null) return [];

    // TODO: automate remove passwordHash
    const users = await this.userRepo.findBy({
      role: juniorRole,
      department: department,
      is_approved: false,
    });

    return users.map(({ passwordHash, ...rest }) => rest);
  }

  async approveRequests(role: UserRole, emails: string[]) {
    const juniorRole = AuthorityMap.get(role);

    // TODO: handle failures
    return await this.userRepo
      .createQueryBuilder('user')
      .update(User)
      .set({ is_approved: true })
      .where({ role: juniorRole, email: In(emails), is_approved: false })
      .execute();
  }

  login(payload: SignableJwtPayload) {
    const token: string = this.jwtService.sign(payload);

    return { token };
  }
}
