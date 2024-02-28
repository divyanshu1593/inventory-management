import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

const IsNotEmptyString = () => (target: any, propertyKey: string | symbol) => {
  IsNotEmpty()(target, propertyKey);
  IsString()(target, propertyKey);
};

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
