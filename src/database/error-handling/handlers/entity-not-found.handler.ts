import { EntityNotFoundError } from 'typeorm';
import { CanHandle } from '../error-handler.adapter';

export const EntityNotFoundHandler: CanHandle = (error) => {
  return error instanceof EntityNotFoundError;
};
