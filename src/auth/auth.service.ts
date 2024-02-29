import { Injectable } from '@nestjs/common';
import { UserSignupDto } from './dto/user-signup.dto';
import * as bcrypt from 'bcrypt';
import { UserPendingApproval } from 'src/database/entities/user-pending-approval.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserRole } from 'src/database/entities/user.roles';
import { AuthorityMap } from './authority-maping';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserPendingApproval)
    private readonly userPendingApprovalRepo: Repository<UserPendingApproval>,
    private readonly dataSource: DataSource,
    private readonly authorityMap: AuthorityMap,
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
    const juniorRole = this.authorityMap.info.get(role);
    if (juniorRole === null) return [];

    return await this.userPendingApprovalRepo.findBy({
      role: juniorRole,
    });
  }

  async approveRequests(role: UserRole, emails: string[]): Promise<string[]> {
    const juniorRole = this.authorityMap.info.get(role);
    const notApprovable = [];

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
}
