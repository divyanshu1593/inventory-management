import { Module } from '@nestjs/common';
import { DatabaseSeeder } from './database-seeder.service';
import { UserSeeder } from './entity-seeders/user.seeder';
import { RawMaterialSeeder } from './entity-seeders/raw-material.seeder';
import { ProductSeeder } from './entity-seeders/product.seeder';
import { MachineSeeder } from './entity-seeders/machine.seeder';
import { ProductSaleSeeder } from './entity-seeders/product-sale.seeder';
import { RawMaterialImportSeeder } from './entity-seeders/raw-material-import.seeder';

@Module({
  providers: [
    DatabaseSeeder,
    UserSeeder,
    RawMaterialSeeder,
    ProductSeeder,
    MachineSeeder,
    ProductSaleSeeder,
    RawMaterialImportSeeder,
    //
  ],
  exports: [DatabaseSeeder],
})
export class DatabaseSeedingModule {}
