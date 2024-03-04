import { EntityNotFoundError } from 'typeorm';
import type { CanHandle } from '../error-handler.adapter';

export const EntityNotFoundHandler: CanHandle = (error) =>
  error instanceof EntityNotFoundError;
