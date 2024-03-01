import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { UUID } from 'crypto';
import { IsNotEmptyString } from 'src/core/decorators/is-not-empty-string.decorator';

export class MachineInfoDto {
  @IsNotEmptyString()
  name: string;

  @ValidateNested()
  @Type(() => UniqueIdentifiableEntity)
  @IsArray()
  @ArrayNotEmpty()
  consumes: UniqueIdentifiableEntity[];
}

export class UniqueIdentifiableEntity {
  @IsUUID()
  id: UUID;
}
