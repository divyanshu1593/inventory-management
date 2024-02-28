import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { AppConfigService } from './config/config.service';
import { ValidationPipe } from '@nestjs/common';
import { GlobalApiTransformApiInterceptor } from './interceptor/global-api-transfrom.interceptor';
import { HttpExceptionTransformFilter } from './filters/failure-transformer.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const configService = app.get(AppConfigService);

  const port = configService.get('PORT');

  // Response Transformers
  app.useGlobalFilters(new HttpExceptionTransformFilter());
  app.useGlobalInterceptors(new GlobalApiTransformApiInterceptor());

  await app.listen(port);
}
bootstrap();
