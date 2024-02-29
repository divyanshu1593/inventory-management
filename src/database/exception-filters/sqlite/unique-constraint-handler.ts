import { BadRequestException } from '@nestjs/common';
import { ErrorHandler } from '../sqlite-unique-constraint.filter';

export class UniqueConstraintTransform implements ErrorHandler {
  private UNIQUE_CONSTRAINT_PREFIX =
    'SQLITE_CONSTRAINT: UNIQUE constraint failed: ';

  canHandle(message: string) {
    return message.startsWith(this.UNIQUE_CONSTRAINT_PREFIX);
  }

  transform(message: string) {
    const newMessage =
      message.replace(this.UNIQUE_CONSTRAINT_PREFIX, '') + ' should be unique';
    return new BadRequestException(newMessage);
  }
}
