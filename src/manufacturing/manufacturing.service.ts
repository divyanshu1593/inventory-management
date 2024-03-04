import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ProductDto } from './dto/product-info.dto';
import { DataSource } from 'typeorm';
import { Product } from 'src/database/entities/product.entity';
import { ManufactureProductDto } from './dto/manufacture-product.dto';
import { ProductionBatch } from 'src/database/entities/production-batch.entity';
import { MachineConsumption } from 'src/database/entities/machine-consumption.entity';
import { Machine } from 'src/database/entities/machine.entity';
import { RawMaterial } from 'src/database/entities/raw-material.entity';
import { tryWith } from 'src/database/error-handling/error-handler.adapter';
import { SqliteForeignConstraint } from 'src/database/error-handling/handlers/foreign-key-constraint.handler';
import { SqliteUniqueConstraint } from 'src/database/error-handling/handlers/unique-constraint.handler';
import { EntityNotFoundHandler } from 'src/database/error-handling/handlers/entity-not-found.handler';

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

      const product = await tryWith(
        transactionalEntityManager.findOneByOrFail(Product, {
          name: productName,
          model: productModel,
          variant: productVariant,
        }),
      )
        .onError(EntityNotFoundHandler, () => {
          throw new NotFoundException('product not found');
        })
        .execute();

      const batchInsertResult = await tryWith(
        transactionalEntityManager.insert(ProductionBatch, {
          product,
        }),
      )
        .onError(SqliteForeignConstraint, () => {
          throw new NotAcceptableException(
            'product does not satisfy foriegn key constraint',
          );
        })
        .execute();

      // TODO: fix: only primanry keys should be passed as arguments
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
    await tryWith(
      this.dataSource.manager.insert(Product, {
        ...productInfo,
        amount: 0,
      }),
    )
      .onError(SqliteUniqueConstraint, () => {
        throw new NotAcceptableException('Product already exists');
      })
      .execute();
  }
}
