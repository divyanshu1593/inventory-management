import { HttpException } from '@nestjs/common';

export type SuccessResponse<T> = {
  success: true;
  data: T;
};

export type FailureRespone = {
  success: false;
  message: unknown;
  error: string;
  statusCode: number;
};

export function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  return {
    data,
    success: true,
  };
}

export function createFailureResponse(
  exception: HttpException,
): FailureRespone {
  const message = exception.getResponse();
  if (typeof message === 'string') {
    return {
      message,
      error: exception.name,
      statusCode: exception.getStatus(),
      success: false,
    };
  }

  return {
    ...(message as Omit<FailureRespone, 'success'>),
    success: false,
  };
}
