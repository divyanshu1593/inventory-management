import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { createSuccessResponse } from 'src/common/generic-response.dto';

@Injectable()
export class GlobalApiTransformApiInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((x) => createSuccessResponse(x)),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
}
