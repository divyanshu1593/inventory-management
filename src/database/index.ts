import { MachineConsumption } from './entities/machine-consumption.entity';
import { MachineImport } from './entities/machine-import.entity';
import { Machine } from './entities/machine.entity';
import { ProductSale } from './entities/product-sale.entity';
import { Product } from './entities/product.entity';
import { ProductionBatch } from './entities/production-batch.entity';
import { RawMaterialImport } from './entities/raw-material-import.entity';
import { RawMaterial } from './entities/raw-material.entity';
import { User } from './entities/user.entity';

export const AllEntities = [
  User,
  MachineConsumption,
  Machine,
  ProductSale,
  Product,
  ProductionBatch,
  RawMaterialImport,
  RawMaterial,
  MachineImport,
];
