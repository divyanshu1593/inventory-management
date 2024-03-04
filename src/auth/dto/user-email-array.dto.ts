import { ArrayNotEmpty, IsArray, Validate } from 'class-validator';
import { ArrayUniqueString } from 'src/core/decorators/unique-string-array.decorator';

export class userEmailArrayDto {
  @IsArray()
  @Validate(ArrayUniqueString, {
    message: 'All items in $property must be unique',
  })
  @ArrayNotEmpty()
  emails: string[];
}
