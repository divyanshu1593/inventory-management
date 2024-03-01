import { CanHandle } from '../error-handler.adapter';

export const SqliteForeignConstraint: CanHandle = (e: Error) =>
  e.message.startsWith('SQLITE_CONSTRAINT: FOREIGN KEY ');
