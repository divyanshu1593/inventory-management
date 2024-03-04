import { IsNumber, IsUUID, Min } from 'class-validator';
import { UUID } from 'crypto';

export class RawMaterialQuantityDto {
  @IsUUID()
  rawMaterialId: UUID;

  @IsNumber()
  @Min(0)
  amount: number;
}
