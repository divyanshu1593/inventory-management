import { IsNotEmpty, IsString } from 'class-validator';

export const IsNotEmptyString =
  () => (target: any, propertyKey: string | symbol) => {
    IsNotEmpty()(target, propertyKey);
    IsString()(target, propertyKey);
  };
