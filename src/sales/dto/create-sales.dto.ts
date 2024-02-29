import { IsNotEmpty, IsNumber } from 'class-validator';
import { IsNotEmptyString } from 'src/core/decorators/is-not-empty-string.decorator';

export class CreateSalesDto {
  // @IsString()
  // product: CreateProductDto;

  @IsNotEmptyString()
  model: string;

  @IsNotEmptyString()
  name: string;

  @IsNotEmptyString()
  variant: string;

  @IsNumber()
  @IsNotEmpty()
  count: number;

  @IsNotEmptyString()
  to: string;

  @IsNumber()
  @IsNotEmpty()
  total_cost: number;
}
