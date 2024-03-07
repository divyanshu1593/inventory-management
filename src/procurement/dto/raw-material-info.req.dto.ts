import { Transform } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';
import { IsNotEmptyString } from 'src/core/decorators/is-not-empty-string.decorator';

export class RawMaterialInfoDto {
  @IsNumber()
  @Transform(({ value }) => +value)
  @Min(0)
  cost: number;

  @IsNotEmptyString()
  name: string;
}
