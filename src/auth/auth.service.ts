import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserSignupDto } from './dto/user-signup.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, In, Repository } from 'typeorm';
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

  private getJuniorRole(role: UserRole): FindOperator<UserRole> {
    return role === UserRole.ADMIN
      ? In([UserRole.DEPARTMENT_HEAD, UserRole.MANAGER, UserRole.OPERATOR])
      : In([AuthorityMap.get(role)]);
  }

  async getApprovableRequests(role: UserRole, department: CompanyDepartment) {
    const juniorRole = this.getJuniorRole(role);

    const _dept = role === UserRole.ADMIN ? null : department;

    return await this.userRepo.findBy({
      role: juniorRole,
      department: _dept,
      is_approved: false,
    });
  }

  async approveRequests(
    role: UserRole,
    department: CompanyDepartment,
    emails: string[],
  ) {
    const juniorRole = this.getJuniorRole(role);

    const baseFindOptions = {
      role: juniorRole,
      email: In(emails),
      is_approved: false,
    };

    const moreFindOptions = role === UserRole.ADMIN ? {} : { department };

    const result = await this.userRepo
      .createQueryBuilder('user')
      .update(User)
      .set({ is_approved: true })
      .where({
        ...baseFindOptions,
        ...moreFindOptions,
      })
      .execute();

    return { affected: result.affected };
  }

  login(payload: SignableJwtPayload) {
    const token: string = this.jwtService.sign(payload);

    return { token };
  }
}
