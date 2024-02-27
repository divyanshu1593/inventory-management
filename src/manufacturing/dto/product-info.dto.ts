import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ProductCategory } from 'src/database/entities/product.category';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => +value)
  @IsNumber()
  @Min(0)
  price: number;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  variant: string;
}
