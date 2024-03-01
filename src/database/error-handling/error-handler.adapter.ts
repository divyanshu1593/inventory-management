import { HttpException } from '@nestjs/common';
import { TypeORMError } from 'typeorm';

type ConstructorOf<T> = new (...args: unknown[]) => T;

export type CanHandle = (e: Error) => boolean;
export type MapToHttpException = (e: Error) => HttpException;

type ErrorHandler = {
  canHandle: CanHandle;
  transform: MapToHttpException;
};

class ErrorHandlerClass<TReturn, TError extends Error> {
  constructor(
    private readonly clazz: ConstructorOf<TError>,
    private readonly callback: Promise<TReturn>,
  ) {}

  private errorHandlers: ErrorHandler[] = [];

  onError(canHandle: CanHandle, handleError: MapToHttpException) {
    this.errorHandlers.push({
      canHandle: canHandle,
      transform: handleError,
    });

    return this;
  }

  async execute() {
    try {
      return await this.callback;
    } catch (e: unknown) {
      if (e instanceof this.clazz) {
        const handler = this.errorHandlers.find(
          (x) => x.canHandle(e as TError), // TODO: remove casting
        );

        if (handler == null) throw e;
        throw handler.transform(e);
      }

      throw e;
    }
  }
}

export function tryWith<T>(cb: Promise<T>) {
  return new ErrorHandlerClass(TypeORMError, cb);
}
