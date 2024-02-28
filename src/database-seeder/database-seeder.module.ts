import { Module } from '@nestjs/common';
import { DatabaseSeeder } from './database-seeder.service';
import { UserSeeder } from './entity-seeders/user.seeder';
import { RawMaterialSeeder } from './entity-seeders/raw-material.seeder';

@Module({
  providers: [
    DatabaseSeeder,
    UserSeeder,
    RawMaterialSeeder,
    //
  ],
  exports: [DatabaseSeeder],
})
export class DatabaseSeedingModule {}
