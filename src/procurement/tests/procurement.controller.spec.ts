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

  describe(`Creation of Machine Entry`, () => {
    it(`Should not create machine entry with same name`, async () => {
      const mockRawMaterial = (
        await seeder.rawMaterialSeeder.createEntry()
      ).getFirstOrFail();

      const mockProduct = (
        await seeder.productSeeder.createEntry()
      ).getFirstOrFail();

      const mockMachine = (
        await seeder.machineSeeder.createEntry()
      ).getFirstOrFail();

      const request = controller.addMachine({
        name: mockMachine.name,
        makes: mockProduct.id,
        consumes: [{ id: mockRawMaterial.id }],
      });

      expect(request).rejects.toThrow('Machine with that name Already Exists');
    });

    it(`Should not create when raw materials are not available`, async () => {
      const mockProduct = (
        await seeder.productSeeder.createEntry()
      ).getFirstOrFail();

      const request = controller.addMachine({
        makes: mockProduct.id,
        consumes: [{ id: 'xxxx-xxxx-xxxx-xxxx-xxxx' }],
        name: 'new_machine',
      });

      expect(request).rejects.toThrow(
        'Specified product or raw-material is not available',
      );
    });

    it(`Should not create when product is not available`, async () => {
      const mockRawMaterial = (
        await seeder.rawMaterialSeeder.createEntry()
      ).getFirstOrFail();

      const request = controller.addMachine({
        makes: 'xxxx-xxxx-xxxx-xxxx-xxxx',
        consumes: [{ id: mockRawMaterial.id }],
        name: 'new_machine',
      });

      expect(request).rejects.toThrow(
        'Specified product or raw-material is not available',
      );
    });

    it(`Should successfully create on valid data`, async () => {
      const created = (
        await seeder.rawMaterialSeeder.createEntry()
      ).getFirstOrFail();

      const mockProduct = (
        await seeder.productSeeder.createEntry()
      ).getFirstOrFail();

      const request = await controller.addMachine({
        makes: mockProduct.id,
        consumes: [created],
        name: 'machine_doesnt_exist',
      });

      expect(request).toMatchObject({
        name: 'machine_doesnt_exist',
        consumes: [{ id: created.id }],
      });
    });
  });

  describe(`Importing a Machine`, () => {
    it(`Should import a machine when it exists`, async () => {
      await seeder.productSeeder.createEntry();

      const mockMachine = (
        await seeder.machineSeeder.createEntry()
      ).getFirstOrFail();

      const { id } = mockMachine;

      const entry = await controller.importMachine({
        count: 100,
        machine_id: id,
        total_cost: 100,
      });

      expect(entry).toMatchObject({
        count: 100,
        total_cost: 100,
        machine: {
          id: id,
        },
      });
    });

    it(`Should NOT import when the machine doesnt exist`, () => {
      const machineImportPromise = controller.importMachine({
        count: 100,
        machine_id: 'does-not-exist-in-db',
        total_cost: 100,
      });

      expect(machineImportPromise).rejects.toThrow('Machine does not exist');
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

      const { id } = randomMaterial;
      const entry = await controller.importRawMaterial({
        count: 100,
        raw_material_id: id,
        total_cost: 1000,
      });

      expect(entry).toMatchObject({
        raw_material: { id },
        count: 100,
        total_cost: 1000,
      });
    });
  });

  describe(`Raw Material Entry Creation`, () => {
    it(`Should create when it doesnt exist`, async () => {
      const mockData = {
        cost: 100,
        name: 'new_material',
      };
      const entry = await controller.addRawMaterial(mockData);
      expect(entry).toMatchObject(mockData);
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
