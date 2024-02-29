import { IsNotEmpty, IsString } from 'class-validator';

export const IsNotEmptyString =
  () =>
  <T extends object>(target: T, propertyKey: string | symbol) => {
    IsNotEmpty()(target, propertyKey);
    IsString()(target, propertyKey);
  };
