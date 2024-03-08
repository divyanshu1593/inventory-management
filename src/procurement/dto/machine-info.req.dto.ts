import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsAlpha,
  IsArray,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { UUID } from 'crypto';
import { IsNotEmptyString } from 'src/core/decorators/is-not-empty-string.decorator';

export class MachineInfoDto {
  @IsAlpha()
  @IsNotEmptyString()
  name: string;

  @ValidateNested()
  @Type(() => UniqueIdentifiableEntity)
  @IsArray()
  @ArrayNotEmpty()
  consumes: UniqueIdentifiableEntity[];

  @IsUUID()
  makes: UUID;
}

export class UniqueIdentifiableEntity {
  @IsUUID()
  id: UUID;
}
