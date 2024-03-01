import { CanHandle } from '../error-handler.adapter';

export const SqliteUniqueConstraint: CanHandle = (e: Error) =>
  e.message.startsWith('SQLITE_CONSTRAINT: UNIQUE constraint failed:');
