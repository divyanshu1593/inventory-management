import { Injectable } from '@nestjs/common';
import { ProductDto } from './dto/product-info.dto';
import { Repository } from 'typeorm';
import { Product } from 'src/database/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ManufacturingService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}
  async addProduct(productInfo: ProductDto): Promise<void> {
    const { name, price, category, model, variant } = productInfo;

    await this.productRepo.insert({
      name,
      price,
      category,
      model,
      variant,
      amount: 0,
    });
  }
}
