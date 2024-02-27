import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { AppConfigService } from './config/config.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(AppConfigService);

  const port = configService.get('PORT');

  await app.listen(port);
}
bootstrap();
