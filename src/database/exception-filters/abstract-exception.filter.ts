import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, catchError } from 'rxjs';

export abstract class AbstractErrorInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((exception) => {
        if (exception instanceof this.interceptedType) {
          this.handleError(exception);
        }
        throw exception;
      }),
    );
  }
  protected interceptedType: new (...args) => T;

  abstract handleError(exception: T);
}
