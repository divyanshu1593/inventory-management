import { Injectable } from '@nestjs/common';
import { UserSeeder } from './entity-seeders/user.seeder';
import { RawMaterialSeeder } from './entity-seeders/raw-material.seeder';

@Injectable()
export class DatabaseSeeder {
  constructor(
    private readonly userSeeder: UserSeeder,
    private readonly rawMaterialSeeder: RawMaterialSeeder,
  ) {}

  async seedAll() {
    await Promise.all([
      this.userSeeder.seed(),
      this.rawMaterialSeeder.seed(),
      //
    ]);
  }
}
