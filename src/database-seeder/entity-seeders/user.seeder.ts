import { Injectable } from '@nestjs/common';
import { BaseSeeder } from '../base-seeder';
import { User } from 'src/database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { UserRole } from 'src/database/entities/user.roles';
import { SeedUtils } from '../seed-utils';

@Injectable()
export class UserSeeder extends BaseSeeder<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super(userRepo);
  }

  async generate(index: number): Promise<DeepPartial<User>[]> {
    const role = SeedUtils.randomEnum(UserRole);
    return [
      {
        address: `address_${index}`,
        email: `email_${index}@example.com`,
        name: `name_${index}`,
        role: role,
      },
    ];
  }
}
