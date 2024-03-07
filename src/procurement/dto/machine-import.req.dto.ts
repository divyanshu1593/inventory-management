import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';
import { UUID } from 'crypto';

export class MachineImportDto {
  @IsUUID()
  machine_id: UUID;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  count: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  total_cost: number;
}
