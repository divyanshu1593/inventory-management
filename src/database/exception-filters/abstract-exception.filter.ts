import {
  CallHandler,
  ExecutionContext,
  HttpException,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';

export abstract class AbstractErrorInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      catchError((exception) => {
        if (exception instanceof this.interceptedType) {
          this.handleError(exception);
        }
        throw exception;
      }),
    );
  }
  protected interceptedType: new (...args: unknown[]) => T;

  abstract handleError(exception: T): HttpException;
}
