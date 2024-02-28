import { Test, type TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { ProductCategory } from 'src/database/entities/product.category';

describe('createSales', () => {
  let salesService: SalesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesService],
    }).compile();

    salesService = module.get<SalesService>(SalesService);
  });

  it('should add sales', () => {
    const data = {
      name: 'iPhone',
      model: '13',
      category: ProductCategory.MOBILE_AND_ACCESSORIES,
      price: 120000,
      amount: 4,
      variant: '6/128',
    };
    const sales = salesService.craeteProduct(data);
    expect(sales).toBeDefined();
  });
});
