import { ArrayNotEmpty, IsArray } from 'class-validator';

export class userEmailArrayDto {
  @IsArray()
  @ArrayNotEmpty()
  emails: string[];
}
