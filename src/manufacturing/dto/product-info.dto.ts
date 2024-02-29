import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, Min } from 'class-validator';
import { ProductCategory } from 'src/database/entities/product.category';
import { IsNotEmptyString } from 'src/core/decorators/is-not-empty-string.decorator';

export class ProductDto {
  @IsNotEmptyString()
  name: string;

  @Transform(({ value }) => +value)
  @IsNumber()
  @Min(0)
  price: number;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsNotEmptyString()
  model: string;

  @IsNotEmptyString()
  variant: string;
}
