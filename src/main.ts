import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GlobalApiTransformApiInterceptor } from './interceptor/global-api-transfrom.interceptor';
import { HttpExceptionTransformFilter } from './filters/failure-transformer.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const configService = app.get(AppConfigService);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = configService.get('PORT');

  app.use(cookieParser());

  // Response Transformers
  app.useGlobalFilters(new HttpExceptionTransformFilter());
  app.useGlobalInterceptors(new GlobalApiTransformApiInterceptor());

  await app.listen(port);
}
bootstrap();
