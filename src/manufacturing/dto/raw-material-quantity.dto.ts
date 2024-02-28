import { IsNumber, Min } from 'class-validator';
import { IsNotEmptyString } from '../custom-decorators/is-not-empty-string.decorator';

export class RawMaterialQuantityDto {
  @IsNotEmptyString()
  rawMaterialName: string;

  @IsNumber()
  @Min(0)
  amount: number;
}
