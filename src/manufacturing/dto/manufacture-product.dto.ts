import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { RawMaterialQuantityDto } from './raw-material-quantity.dto';
import { IsNotEmptyString } from '../custom-decorators/is-not-empty-string.decorator';

export class ManufactureProductDto {
  @IsNotEmptyString()
  productName: string;

  @IsNotEmptyString()
  productModel: string;

  @IsNotEmptyString()
  productVariant: string;

  @IsNotEmptyString()
  machineName: string;

  @Transform(({ value }) => JSON.parse(value))
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => RawMaterialQuantityDto)
  rawMaterialQuantityArray: RawMaterialQuantityDto[];
}
