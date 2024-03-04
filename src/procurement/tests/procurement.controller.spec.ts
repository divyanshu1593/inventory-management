import { Test } from '@nestjs/testing';
import { ProcurementController } from '../procurement.controller';
import { ProcurementService } from '../procurement.service';
import { DatabaseTestModule } from 'src/database/database.test.module';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseSeedingModule } from 'src/database-seeder/database-seeder.module';
import { DatabaseSeeder } from 'src/database-seeder/database-seeder.service';
import 'src/core/extension-functions';

describe('ProcurementController', () => {
  let controller: ProcurementController;
  let service: ProcurementService;
  let seeder: DatabaseSeeder;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseTestModule, DatabaseModule, DatabaseSeedingModule],
      controllers: [ProcurementController],
      providers: [ProcurementService],
    }).compile();

    service = moduleRef.get(ProcurementService);
    controller = moduleRef.get(ProcurementController);
    seeder = moduleRef.get(DatabaseSeeder);
  });

  describe(`Dependencies should be defined`, () => {
    it(`Controller Should Be Defined`, () => {
      expect(controller).toBeDefined();
    });

    it(`Service Should Be Defined`, () => {
      expect(service).toBeDefined();
    });
  });

  describe(`Importing of Machine`, () => {
    it(`Should not create machine entry with same name`, async () => {
      const mockRawMaterial = await seeder.rawMaterialSeeder.createEntry();
      const mockMachine = await seeder.machineSeeder.createEntry();

      const request = controller.addMachine({
        name: mockMachine[0].name,
        consumes: [{ id: mockRawMaterial[0].id }],
      });

      expect(request).rejects.toThrow('Machine with that name Already Exists');
    });

    it(`Should not create when raw materials are not available`, async () => {
      const request = controller.addMachine({
        consumes: [{ id: 'xxxx-xxxx-xxxx-xxxx-xxxx' }],
        name: 'new_machine',
      });

      expect(request).rejects.toThrow(
        'Specified raw materials are not available',
      );
    });

    it(`Should successfully create on valid data`, async () => {
      const created = (
        await seeder.rawMaterialSeeder.createEntry()
      ).getFirstOrFail();

      const request = await controller.addMachine({
        consumes: [created],
        name: 'machine_doesnt_exist',
      });

      expect(request).toMatchObject({
        name: 'machine_doesnt_exist',
        consumes: [{ id: created.id }],
      });
      // TODO: create test cases for machine importing
    });
  });

  describe(`Raw Material Import`, () => {
    it(`should not import when it doesnt exist`, () => {
      const rawMaterial = controller.importRawMaterial({
        count: 100,
        raw_material_id: 'x-x-x-x-x',
        total_cost: 1000,
      });

      expect(rawMaterial).rejects.toThrow(
        'No such Raw material exists in database',
      );
    });

    it(`Should import when it exists`, async () => {
      const randomMaterial = (
        await seeder.rawMaterialSeeder.createEntry()
      ).getFirstOrFail();

      await controller.importRawMaterial({
        count: 100,
        raw_material_id: randomMaterial.id,
        total_cost: 1000,
      });
    });
  });

  describe(`Raw Material Entry Creation`, () => {
    it(`Should create when it doesnt exist`, async () => {
      await controller.addRawMaterial({
        amount: 100,
        cost: 100,
        name: 'new_material',
      });
    });

    it(`should not create when it already exists`, async () => {
      const created = (
        await seeder.rawMaterialSeeder.createEntry()
      ).getFirstOrFail();
      const { id, ...rest } = created;

      const creationPromise = controller.addRawMaterial(rest);

      expect(creationPromise).rejects.toThrow();
    });
  });
});
