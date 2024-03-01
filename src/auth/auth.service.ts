import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserSignupDto } from './dto/user-signup.dto';
import * as bcrypt from 'bcrypt';
import { UserPendingApproval } from 'src/database/entities/user-pending-approval.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserRole } from 'src/database/entities/user.roles';
import { User } from 'src/database/entities/user.entity';
import { AuthorityMap } from './authority-maping';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserPendingApproval)
    private readonly userPendingApprovalRepo: Repository<UserPendingApproval>,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
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

  async getApprovalbleRequests(role: UserRole) {
    const juniorRole = AuthorityMap.get(role);
    if (juniorRole === null) return [];

    // TODO: automate remove passwordHash
    const users = await this.userPendingApprovalRepo.findBy({
      role: juniorRole,
    });

    return users.map(({ passwordHash, ...rest }) => rest);
  }

  async approveRequests(role: UserRole, emails: string[]): Promise<string[]> {
    const juniorRole = AuthorityMap.get(role);
    const notApprovable: string[] = [];

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      for (const userEmail of emails) {
        const userToBeAppraved =
          await transactionalEntityManager.findOneByOrFail(
            UserPendingApproval,
            {
              email: userEmail,
            },
          );

        if (userToBeAppraved.role !== juniorRole) {
          notApprovable.push(userEmail);
          continue;
        }

        await transactionalEntityManager.delete(
          UserPendingApproval,
          userToBeAppraved,
        );

        const { name, email, passwordHash, address, role } = userToBeAppraved;

        await transactionalEntityManager.insert(User, {
          name,
          email,
          passwordHash,
          address,
          role,
        });
      }
    });

    return notApprovable;
  }

  login(payload: object) {
    const token: string = this.jwtService.sign(payload);

    return { token };
  }
}
