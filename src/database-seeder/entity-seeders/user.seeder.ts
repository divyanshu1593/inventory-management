import { Injectable } from '@nestjs/common';
import { BaseSeeder } from '../base-seeder';
import { User } from 'src/database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { UserRole } from 'src/database/entities/user.roles';
import { SeedUtils } from '../seed-utils';
import * as bcrypt from 'bcrypt';
import { CompanyDepartment } from 'src/database/entities/company-departments';

@Injectable()
export class UserSeeder extends BaseSeeder<User> {
  private COMMON_PASSWORD = 'password';
  private COMMON_PASSWORD_HASH = bcrypt.hashSync(
    this.COMMON_PASSWORD,
    bcrypt.genSaltSync(1),
  );

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super(userRepo);
  }

  async generate(index: number): Promise<DeepPartial<User>[]> {
    const role = SeedUtils.randomEnum(UserRole);
    const dept = SeedUtils.randomEnum(CompanyDepartment);
    return [
      {
        address: `address_${index}`,
        email: `email_${index}@example.com`,
        name: `name_${index}`,
        role: role,
        passwordHash: this.COMMON_PASSWORD_HASH,
        is_approved: true,
        department: dept,
      },
    ];
  }
}
