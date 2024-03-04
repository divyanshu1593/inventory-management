import {
  ArrayNotEmpty,
  IsArray,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RawMaterialQuantityDto } from './raw-material-quantity.dto';
import { UUID } from 'crypto';
import { ArrayClassUnique } from 'src/core/decorators/array-unique.decorator';

export class ManufactureProductDto {
  @IsUUID()
  productId: UUID;

  @IsUUID()
  machineId: UUID;

  @IsArray()
  @ArrayClassUnique(RawMaterialQuantityDto, (rm) => rm.rawMaterialId)
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => RawMaterialQuantityDto)
  rawMaterialQuantityArray: RawMaterialQuantityDto[];
}
