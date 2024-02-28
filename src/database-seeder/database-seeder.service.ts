import { Injectable } from '@nestjs/common';
import { UserSeeder } from './entity-seeders/user.seeder';
import { RawMaterialSeeder } from './entity-seeders/raw-material.seeder';
import { ProductSeeder } from './entity-seeders/product.seeder';
import { MachineSeeder } from './entity-seeders/machine.seeder';
import { ProductSaleSeeder } from './entity-seeders/product-sale.seeder';
import { RawMaterialImportSeeder } from './entity-seeders/raw-material-import.seeder';

@Injectable()
export class DatabaseSeeder {
  constructor(
    private readonly userSeeder: UserSeeder,
    private readonly rawMaterialSeeder: RawMaterialSeeder,
    private readonly productSeeder: ProductSeeder,
    private readonly machineSeeder: MachineSeeder,
    private readonly productSaleSeeder: ProductSaleSeeder,
    private readonly rawMaterialImportSeeder: RawMaterialImportSeeder,
  ) {}

  async seedAll() {
    // synchronous due to foreign key constraints
    await this.userSeeder.seed();
    await this.rawMaterialSeeder.seed();
    await this.productSeeder.seed();
    await this.machineSeeder.seed();
    await this.productSaleSeeder.seed();
    this.rawMaterialImportSeeder.seed();
  }
}
