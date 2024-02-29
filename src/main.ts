import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { AppConfigService } from './config/config.service';
import { ValidationPipe } from '@nestjs/common';
import { TypeORMErrorFilter } from './database/exception-filters/sqlite-unique-constraint.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const configService = app.get(AppConfigService);

  app.useGlobalInterceptors(new TypeORMErrorFilter());
  const port = configService.get('PORT');

  await app.listen(port);
}
bootstrap();
