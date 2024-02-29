import { Catch, HttpException } from '@nestjs/common';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { AbstractErrorInterceptor } from './abstract-exception.filter';
import { AllSqliteHandlers } from './sqlite';

export interface ErrorHandler {
  canHandle(message: string): boolean;
  transform(message: string): HttpException;
}

@Catch(QueryFailedError)
export class TypeORMErrorFilter extends AbstractErrorInterceptor<QueryFailedError> {
  protected interceptedType = QueryFailedError;

  handleError(exception: TypeORMError) {
    const handlerFound = AllSqliteHandlers.find((h) =>
      h.canHandle(exception.message),
    );

    if (handlerFound != null) {
      throw handlerFound.transform(exception.message);
    }
    // re-throw unhandled exceptions
    throw exception;
  }
}
