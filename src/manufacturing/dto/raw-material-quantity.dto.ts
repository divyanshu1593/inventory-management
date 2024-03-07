import { Transform } from 'class-transformer';
import { IsNumber, IsUUID, Min } from 'class-validator';
import { UUID } from 'crypto';

export class RawMaterialQuantityDto {
  @IsUUID()
  rawMaterialId: UUID;

  @IsNumber()
  @Transform(({ value }) => +value)
  @Min(0)
  amount: number;
}
