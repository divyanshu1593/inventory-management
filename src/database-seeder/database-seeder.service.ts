import { Injectable } from '@nestjs/common';
import { UserSeeder } from './entity-seeders/user.seeder';
import { RawMaterialSeeder } from './entity-seeders/raw-material.seeder';
import { ProductSeeder } from './entity-seeders/product.seeder';
import { MachineSeeder } from './entity-seeders/machine.seeder';
import { ProductSaleSeeder } from './entity-seeders/product-sale.seeder';
import { RawMaterialImportSeeder } from './entity-seeders/raw-material-import.seeder';
import { ProductionBatchSeeder } from './entity-seeders/production-batch.seeder';
import { MachineConsumptionSeeder } from './entity-seeders/machine-consumption.seeder';

@Injectable()
export class DatabaseSeeder {
  constructor(
    readonly userSeeder: UserSeeder,
    readonly rawMaterialSeeder: RawMaterialSeeder,
    readonly productSeeder: ProductSeeder,
    readonly machineSeeder: MachineSeeder,
    readonly productSaleSeeder: ProductSaleSeeder,
    readonly rawMaterialImportSeeder: RawMaterialImportSeeder,
    readonly productionBatchSeeder: ProductionBatchSeeder,
    readonly machineConsumptionSeeder: MachineConsumptionSeeder,
  ) {}

  async seedAll() {
    // serialized due to foreign key constraints
    await this.userSeeder.seed();
    await this.rawMaterialSeeder.seed();
    await this.productSeeder.seed();
    await this.machineSeeder.seed();
    await this.productSaleSeeder.seed();
    await this.rawMaterialImportSeeder.seed();
    await this.productionBatchSeeder.seed();
    await this.machineConsumptionSeeder.seed();
  }
}
