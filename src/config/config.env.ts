import { plainToInstance } from 'class-transformer';
import { IsInt, Max, Min, validateSync } from 'class-validator';

export class Env {
  @IsInt()
  @Min(0)
  @Max(65535)
  PORT: number = 3000;
}

export const validate = (env: Record<string, unknown>) => {
  const transformed = plainToInstance(Env, env, {
    enableImplicitConversion: true,
    exposeDefaultValues: true,
  });
  const errors = validateSync(transformed);
  if (errors.length > 0) throw new Error(errors.toString());

  return transformed;
};
