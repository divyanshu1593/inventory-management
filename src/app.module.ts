import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/config.env';
import { SalesModule } from './sales/sales.module';
import { DatabaseModule } from './database/database.module';
import { ManufacturingModule } from './manufacturing/manufacturing.module';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config/config.module';
import { ProcurementModule } from './procurement/procurement.module';
import { TypeOrmConnectionModule } from './database/typeorm-root.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validate }),
    AppConfigModule,
    TypeOrmConnectionModule,
    SalesModule,
    DatabaseModule,
    ManufacturingModule,
    AuthModule,
    ProcurementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
