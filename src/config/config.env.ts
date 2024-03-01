import { Transform, plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export class Env {
  @IsInt()
  @Min(0)
  @Max(65535)
  @Transform(({ value }) => parseInt(value))
  PORT: number = 3000;

  @IsBoolean()
  @Transform(({ value }) => value.toString().toLowerCase() === 'true')
  SEED: boolean = false;

  @IsString()
  JWT_SECRET_KEY: string;
}

export const validate = (env: Record<string, unknown>) => {
  const transformed = plainToInstance(Env, env, {
    exposeDefaultValues: true,
  });
  const errors = validateSync(transformed);
  if (errors.length > 0) throw new Error(errors.toString());

  return transformed;
};
