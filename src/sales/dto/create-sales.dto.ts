import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { UUID } from 'crypto';
import { IsNotEmptyString } from 'src/core/decorators/is-not-empty-string.decorator';

export class CreateSalesDto {
  @IsUUID()
  product_id: UUID;

  @IsNumber()
  @Transform(({ value }) => +value)
  @IsNotEmpty()
  count: number;

  @IsNotEmptyString()
  to: string;

  @IsNumber()
  @Transform(({ value }) => +value)
  @IsNotEmpty()
  total_cost: number;
}
