import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { IsNotEmptyString } from 'src/core/decorators/is-not-empty-string.decorator';

export class RawMaterialInfoDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  cost: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  amount: number;

  @IsNotEmptyString()
  name: string;
}
