import { Injectable } from '@nestjs/common';
import { CreateSalesDto } from './dto/create-sales.dto';
import { LessThanOrEqual, type Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/database/entities/product.entity';
import { ProductSale } from 'src/database/entities/product-sale.entity';
import { UUID } from 'crypto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(ProductSale)
    private readonly salesRepo: Repository<ProductSale>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async createSale(createSalesDto: CreateSalesDto) {
    const { model, name, variant, count, to, total_cost } = createSalesDto;

    //get product
    const product = await this.productRepo.findOneOrFail({
      where: {
        name: name,
        model: model,
        variant: variant,
      },
    });

    //create sale
    const countedCost = total_cost ?? product.price * count;
    const sale = this.salesRepo.create({
      product: product,
      count,
      to,
      total_cost: countedCost,
    });
    return await this.salesRepo.save(sale);
  }

  async getSales() {
    const products = await this.salesRepo.find({
      relations: ['product'],
      order: { date: 'DESC' },
    });
    return products;
  }

  async getSalesById(productId: UUID) {
    const productSales = await this.salesRepo.find({
      relations: ['product'],
      where: { id: productId },
    });
    return productSales;
  }

  async getSalesByTotalCost(totalCost: number) {
    const products = await this.salesRepo.find({
      relations: ['product'],
      where: { total_cost: LessThanOrEqual(totalCost) },
      order: { date: 'DESC' },
    });
    return products;
  }
}
