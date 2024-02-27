import { Injectable } from '@nestjs/common';
import { CreateSalesDto } from './dto/create-sales.dto';
import type { Repository } from 'typeorm';
import { ProductSale } from 'src/database/entities/product-sale.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/database/entities/product.entity';
import type { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(ProductSale)
    private readonly salesRepo: Repository<ProductSale>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async craeteProduct(craeteProductDto: CreateProductDto) {
    const product = this.productRepo.create(craeteProductDto);
    return await this.productRepo.save(product);
  }

  async createSales(createSalesDto: CreateSalesDto) {
    const { model, name, variant, count, to } = createSalesDto;
    const product = await this.productRepo.findOne({
      where: { model, name, variant },
    });

    const sale = this.salesRepo.create({
      product: product,
      count,
      to,
      total_cost: product.price * count,
    });
    return await this.salesRepo.save(sale);
  }
}
