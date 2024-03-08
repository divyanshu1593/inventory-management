import { Transform } from 'class-transformer';
import { IsNumber, IsUUID, Min } from 'class-validator';
import { UUID } from 'crypto';
import { IsNotEmptyString } from 'src/core/decorators/is-not-empty-string.decorator';

export class CreateSalesDto {
  @IsUUID()
  product_id: UUID;

  @IsNumber()
  @Transform(({ value }) => +value)
  @Min(1)
  count: number;

  @IsNotEmptyString()
  to: string;

  @IsNumber()
  @Transform(({ value }) => +value)
  @Min(0)
  total_cost: number;
}
