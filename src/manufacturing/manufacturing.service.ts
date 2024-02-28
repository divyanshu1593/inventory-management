import { Injectable, NotAcceptableException } from '@nestjs/common';
import { ProductDto } from './dto/product-info.dto';
import { DataSource } from 'typeorm';
import { Product } from 'src/database/entities/product.entity';
import { ManufactureProductDto } from './dto/manufacture-product.dto';
import { ProductionBatch } from 'src/database/entities/production-batch.entity';
import { MachineConsumption } from 'src/database/entities/machine-consumption.entity';
import { Machine } from 'src/database/entities/machine.entity';
import { RawMaterial } from 'src/database/entities/raw-material.entity';

@Injectable()
export class ManufacturingService {
  constructor(private readonly dataSource: DataSource) {}

  async manufactureProduct(
    manufactureProductDto: ManufactureProductDto,
  ): Promise<void> {
    const {
      productName,
      productModel,
      productVariant,
      machineName,
      rawMaterialQuantityArray,
    } = manufactureProductDto;

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      const rawMaterialSet = new Set(
        rawMaterialQuantityArray.map((val) => val.rawMaterialName),
      );

      if (rawMaterialSet.size !== rawMaterialQuantityArray.length) {
        throw new NotAcceptableException(
          'multiple raw material entry present in rawMaterialQuantityArray',
        );
      }

      const canConsume: { raw_material_name: string }[] =
        await transactionalEntityManager
          .createQueryBuilder(Machine, 'machine')
          .innerJoinAndSelect('machine.consumes', 'raw_material')
          .select('raw_material.name')
          .where('machine.name = :machineName', { machineName })
          .getRawMany();

      let itemMatchCnt = 0;
      for (const rawMaterial of canConsume) {
        if (rawMaterialSet.has(rawMaterial.raw_material_name)) {
          itemMatchCnt++;
        }
      }

      if (rawMaterialQuantityArray.length !== itemMatchCnt) {
        throw new NotAcceptableException(
          'some raw material cant be combined with provided machine',
        );
      }

      const product = await transactionalEntityManager.findOneBy(Product, {
        name: productName,
        model: productModel,
        variant: productVariant,
      });

      const batchInsertResult = await transactionalEntityManager.insert(
        ProductionBatch,
        {
          product,
        },
      );

      for (const rawMaterialQuantity of rawMaterialQuantityArray) {
        await transactionalEntityManager.insert(MachineConsumption, {
          batch: await transactionalEntityManager.findOneBy(ProductionBatch, {
            id: batchInsertResult.identifiers[0].id,
          }),
          machine: await transactionalEntityManager.findOneBy(Machine, {
            name: machineName,
          }),
          raw_material: await transactionalEntityManager.findOneBy(
            RawMaterial,
            {
              name: rawMaterialQuantity.rawMaterialName,
            },
          ),
          raw_material_count: rawMaterialQuantity.amount,
        });
      }
    });
  }

  async addProduct(productInfo: ProductDto): Promise<void> {
    await this.dataSource.manager.insert(Product, {
      ...productInfo,
      amount: 0,
    });
  }
}
