import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { IsNotEmptyString } from 'src/core/decorators/is-not-empty-string.decorator';

export class RawMaterialInfoDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  cost: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;

  @IsNotEmptyString()
  name: string;
}
