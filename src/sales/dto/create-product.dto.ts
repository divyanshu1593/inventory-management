import { IsEnum, IsNumber, IsString } from 'class-validator';
import { ProductCategory } from 'src/database/entities/product.category';

export class CreateProductDto {
  // @IsString()
  // product: string;

  @IsString()
  model: string;

  @IsString()
  name: string;

  @IsNumber()
  variant: string;

  @IsNumber()
  price: number;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsNumber()
  amount: number;
}
