import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { ProductDto } from './dto/product-info.dto';
import { DataSource } from 'typeorm';
import { Product } from 'src/database/entities/product.entity';
import { ManufactureProductDto } from './dto/manufacture-product.dto';
import { ProductionBatch } from 'src/database/entities/production-batch.entity';
import { MachineConsumption } from 'src/database/entities/machine-consumption.entity';
import { tryWith } from 'src/database/error-handling/error-handler.adapter';
import { SqliteForeignConstraint } from 'src/database/error-handling/handlers/foreign-key-constraint.handler';
import { SqliteUniqueConstraint } from 'src/database/error-handling/handlers/unique-constraint.handler';
import { Machine } from 'src/database/entities/machine.entity';
import { EntityNotFoundHandler } from 'src/database/error-handling/handlers/entity-not-found.handler';

@Injectable()
export class ManufacturingService {
  constructor(private readonly dataSource: DataSource) {}

  async manufactureProduct(manufactureProductDto: ManufactureProductDto) {
    const { machineId, productId, rawMaterialQuantityArray, productAmount } =
      manufactureProductDto;

    return await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        const rawMaterialIds = rawMaterialQuantityArray.map(
          (x) => x.rawMaterialId,
        );

        const machineInfo = await tryWith(
          this.dataSource.getRepository(Machine).findOneOrFail({
            where: {
              id: machineId,
              makes: {
                id: productId,
              },
            },
            relations: {
              consumes: true,
              makes: true,
            },
          }),
        )
          .onError(
            EntityNotFoundHandler,
            () =>
              new BadRequestException(
                'No Such Machine with ID and Raw Materials found.',
              ),
          )
          .execute();

        // TODO: check for all the raw materials using MachineInfo

        const productionBatch = transactionalEntityManager.create(
          ProductionBatch,
          {
            product: { id: productId },
            amount: productAmount,
          },
        );

        await tryWith(transactionalEntityManager.save(productionBatch))
          .onError(SqliteForeignConstraint, () => {
            throw new NotAcceptableException(
              'product does not satisfy foreign key constraint',
            );
          })
          .execute();

        await transactionalEntityManager
          .createQueryBuilder(Product, 'product')
          .update()
          .set({
            amount: () => `amount + :productAmount`,
          })
          .setParameter('productAmount', productAmount)
          .where('product.id = :productId', { productId })
          .execute();

        await tryWith(
          transactionalEntityManager.query(
            `UPDATE raw_material
          SET amount = CASE
          ${rawMaterialQuantityArray
            .map((rawMaterialInfo) => {
              return `WHEN id = '${rawMaterialInfo.rawMaterialId}' AND amount - ${rawMaterialInfo.amount} > 0 THEN amount - ${rawMaterialInfo.amount}`;
            })
            .join(' ')}
          END
          WHERE id in (${rawMaterialIds.map((x) => `'${x}'`).join()})`,
          ),
        )
          .onError(
            () => true,
            () => new NotAcceptableException('raw material is out of stock'),
          )
          .execute();

        const mapped = rawMaterialQuantityArray.map((rm) =>
          transactionalEntityManager.create(MachineConsumption, {
            batch: { id: productionBatch.id },
            machine: { id: machineId },
            raw_material: { id: rm.rawMaterialId },
            raw_material_count: rm.amount,
          }),
        );

        return await transactionalEntityManager.save(mapped);
      },
    );
  }

  async addProduct(productInfo: ProductDto) {
    const created = this.dataSource.manager.create(Product, {
      ...productInfo,
      amount: 0,
    });
    return await tryWith(this.dataSource.manager.save(created))
      .onError(SqliteUniqueConstraint, () => {
        throw new NotAcceptableException('Product already exists');
      })
      .execute();
  }

  async getAllProducts() {
    return await this.dataSource.manager.find(Product);
  }

  async getManufacturedProductInfo() {
    return await this.dataSource
      .createQueryBuilder(MachineConsumption, 'machine_consumtion')
      .innerJoinAndSelect('machine_consumtion.batch', 'production_batch')
      .innerJoinAndSelect('machine_consumtion.machine', 'machine')
      .innerJoinAndSelect('machine_consumtion.raw_material', 'raw_material')
      .innerJoinAndSelect('production_batch.product', 'product')
      .getRawMany();
  }
}
