import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: ArrayUniqueString.name })
export class ArrayUniqueString implements ValidatorConstraintInterface {
  validate(values: string[] = []): boolean {
    const unique = new Set(values);
    return values.length == unique.size;
  }
}
