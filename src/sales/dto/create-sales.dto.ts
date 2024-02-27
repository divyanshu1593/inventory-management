import { IsNumber, IsString } from 'class-validator';

export class CreateSalesDto {
  // @IsString()
  // product: CreateProductDto;

  @IsString()
  model: string;

  @IsString()
  name: string;

  @IsString()
  variant: string;

  @IsNumber()
  count: number;

  @IsString()
  to: string;

  @IsNumber()
  total_cost: number;
}
