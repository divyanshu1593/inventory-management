import { Injectable } from '@nestjs/common';
import { UserSeeder } from './entity-seeders/user.seeder';
import { RawMaterialSeeder } from './entity-seeders/raw-material.seeder';
import { ProductSeeder } from './entity-seeders/product.seeder';

@Injectable()
export class DatabaseSeeder {
  constructor(
    private readonly userSeeder: UserSeeder,
    private readonly rawMaterialSeeder: RawMaterialSeeder,
    private readonly productSeeder: ProductSeeder,
  ) {}

  async seedAll() {
    const seeders = [
      this.userSeeder,
      this.rawMaterialSeeder,
      this.productSeeder,
    ];
    await Promise.all(seeders.map((a) => a.seed()));
  }
}
