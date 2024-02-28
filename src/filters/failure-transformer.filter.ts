import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { createFailureResponse } from 'src/common/generic-response.dto';

@Catch(HttpException)
export class HttpExceptionTransformFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const responseJson = createFailureResponse(exception);

    response.status(status).json(responseJson);
  }
}
