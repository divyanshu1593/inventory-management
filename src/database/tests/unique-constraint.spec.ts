import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseTestModule } from '../database.test.module';
import { DatabaseModule } from '../database.module';
import { Product } from '../entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ProductCategory } from '../entities/product.category';
import { Machine } from '../entities/machine.entity';
import { RawMaterial } from '../entities/raw-material.entity';
import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user.roles';
import { CompanyDepartment } from '../entities/company-departments';

describe(`Must adhere to unique constraints`, () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [DatabaseTestModule, DatabaseModule],
    }).compile();
  });

  // Machine
  it(`Should fail on adding two machines with same name`, async () => {
    const productRepo = moduleRef.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    const mockProduct = productRepo.create({
      amount: 10,
      model: 'model',
      name: 'mock',
      price: 1000,
      variant: 'vcariant',
      category: ProductCategory.APPLIANCES,
    });
    await productRepo.save(mockProduct);

    const mockMachine: DeepPartial<Machine> = {
      name: 'water',
      makes: { id: mockProduct.id },
    };

    const machineRepo: Repository<Machine> = moduleRef.get(
      getRepositoryToken(Machine),
    );

    const water = machineRepo.create(mockMachine);
    const water_copy = machineRepo.create(mockMachine);

    await machineRepo.save(water);
    expect(await machineRepo.count()).toBe(1);

    expect(machineRepo.save(water_copy)).rejects.toThrow();
    expect(await machineRepo.count()).toBe(1);
  });

  it(`Should fail on adding machine with non existing product`, async () => {
    const mockMachine: DeepPartial<Machine> = {
      name: 'water',
      makes: { id: 'this-product-does-not-exist' },
    };

    const machineRepo: Repository<Machine> = moduleRef.get(
      getRepositoryToken(Machine),
    );

    const water = machineRepo.create(mockMachine);
    expect(machineRepo.save(water)).rejects.toThrow(
      'SQLITE_CONSTRAINT: FOREIGN KEY constraint failed',
    );
  });

  // Product
  it(`Should not add multiple products with same name`, async () => {
    const mockProduct = {
      name: 'name',
      model: 'model',
      variant: 'variant',
      category: ProductCategory.MOBILE_AND_ACCESSORIES,
      price: 100,
      amount: 100,
    };
    const productRepo: Repository<Product> = moduleRef.get(
      getRepositoryToken(Product),
    );

    const name_model_variant = productRepo.create(mockProduct);
    const name_model_variant_copy = productRepo.create(mockProduct);

    // should successfully add the first one
    await productRepo.save(name_model_variant);
    expect(await productRepo.count()).toBe(1);

    // should fail on the one with same name_model_variant
    expect(productRepo.save(name_model_variant_copy)).rejects.toThrow();
  });

  // RawMaterial
  it(`Should fail on entering two same named raw materials`, async () => {
    const mockRawMaterial = {
      name: 'water',
      amount: 100,
      cost: 100,
    };
    const rawMaterialRepo: Repository<RawMaterial> = moduleRef.get(
      getRepositoryToken(RawMaterial),
    );

    const water = rawMaterialRepo.create(mockRawMaterial);
    const water_copy = rawMaterialRepo.create(mockRawMaterial);

    await rawMaterialRepo.save(water);
    expect(await rawMaterialRepo.count()).toBe(1);

    expect(rawMaterialRepo.save(water_copy)).rejects.toThrow();
    expect(await rawMaterialRepo.count()).toBe(1);
  });

  // User
  it(`Should fail on adding two users with same email`, async () => {
    const userRepo: Repository<User> = moduleRef.get(getRepositoryToken(User));

    const mockUser = {
      email: 'mock@example.com',
      address: 'address',
      name: 'mock',
      role: UserRole.OPERATOR,
      passwordHash: 'mock',
      is_approved: false,
      department: CompanyDepartment.MANUFACTURING,
    };

    const user1 = userRepo.create(mockUser);
    const user2 = userRepo.create(mockUser);

    await userRepo.save(user1);
    expect(await userRepo.count()).toBe(1);

    expect(userRepo.save(user2)).rejects.toThrow();

    expect(await userRepo.count()).toBe(1);
  });
});
