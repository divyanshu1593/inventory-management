import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { UUID } from 'crypto';
import { IsNotEmptyString } from 'src/core/decorators/is-not-empty-string.decorator';

export class CreateSalesDto {
  @IsUUID()
  product_id: UUID;

  @IsNumber()
  @IsNotEmpty()
  count: number;

  @IsNotEmptyString()
  to: string;

  @IsNumber()
  @IsNotEmpty()
  total_cost: number;
}
