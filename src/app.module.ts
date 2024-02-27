import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllEntities } from './database';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/config.env';
import { AppConfigService } from './config/config.service';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validate }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite3',
      entities: AllEntities,
      synchronize: true,
    }),
    SalesModule,
  ],
  controllers: [AppController],
  // TODO: check re-exporting of AppConfigService
  providers: [AppService, AppConfigService],
})
export class AppModule {}
