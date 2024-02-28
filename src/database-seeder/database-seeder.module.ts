import { Module } from '@nestjs/common';
import { DatabaseSeeder } from './database-seeder.service';
import { UserSeeder } from './entity-seeders/user.seeder';
import { RawMaterialSeeder } from './entity-seeders/raw-material.seeder';
import { ProductSeeder } from './entity-seeders/product.seeder';

@Module({
  providers: [
    DatabaseSeeder,
    UserSeeder,
    RawMaterialSeeder,
    ProductSeeder,
    //
  ],
  exports: [DatabaseSeeder],
})
export class DatabaseSeedingModule {}
