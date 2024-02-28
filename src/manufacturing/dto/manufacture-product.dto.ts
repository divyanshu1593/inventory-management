import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  Validate,
  ValidatorConstraint,
} from 'class-validator';
import { RawMaterialQuantity } from '../type/raw-material-quantity.type';
import { Transform } from 'class-transformer';

@ValidatorConstraint()
class IsRawMaterialQuantityArray {
  validate(rawMaterialQuantityArray: RawMaterialQuantity[]) {
    for (const rawMaterialQuantity of rawMaterialQuantityArray) {
      if (typeof rawMaterialQuantity.amount !== 'number') return false;
      if (rawMaterialQuantity.amount < 0) return false;
      if (typeof rawMaterialQuantity.rawMaterialName !== 'string') return false;
      if (rawMaterialQuantity.rawMaterialName === '') return false;
    }

    return true;
  }
}

export class ManufactureProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  productModel: string;

  @IsString()
  @IsNotEmpty()
  productVariant: string;

  @IsString()
  @IsNotEmpty()
  machineName: string;

  @Transform(({ value }) => JSON.parse(value))
  @IsArray()
  @ArrayNotEmpty()
  @Validate(IsRawMaterialQuantityArray, {
    message: 'invalid raw material object',
  })
  rawMaterialQuantityArray: RawMaterialQuantity[];
}
