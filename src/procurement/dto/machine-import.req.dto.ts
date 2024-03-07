import { Transform } from 'class-transformer';
import { IsNumber, IsUUID, Min } from 'class-validator';
import { UUID } from 'crypto';

export class MachineImportDto {
  @IsUUID()
  machine_id: UUID;

  @IsNumber()
  @Transform(({ value }) => +value)
  @Min(1)
  count: number;

  @IsNumber()
  @Transform(({ value }) => +value)
  @Min(0)
  total_cost: number;
}
