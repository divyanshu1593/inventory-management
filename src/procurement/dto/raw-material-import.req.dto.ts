import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';
import { UUID } from 'crypto';

export class RawMaterialImportDto {
  @IsUUID()
  raw_material_id: UUID;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  count: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  total_cost: number;
}
