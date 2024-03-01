import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllEntities } from './database';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/config.env';
import { AppConfigService } from './config/config.service';
import { SalesModule } from './sales/sales.module';
import { DatabaseModule } from './database/database.module';
import { DatabaseSeedingModule } from './database-seeder/database-seeder.module';
import { DatabaseSeeder } from './database-seeder/database-seeder.service';
import { ManufacturingModule } from './manufacturing/manufacturing.module';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config/config.module';
import { ProcurementModule } from './procurement/procurement.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validate }),
    AppConfigModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite3',
      entities: AllEntities,
      synchronize: true,
    }),
    SalesModule,
    DatabaseModule,
    DatabaseSeedingModule,
    ManufacturingModule,
    AuthModule,
    ProcurementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppModule.name);

  constructor(
    private readonly seeder: DatabaseSeeder,
    private readonly config: AppConfigService,
  ) {}

  async onApplicationBootstrap() {
    // seed everything on app start
    if (this.config.get('SEED')) {
      this.logger.log('Seeding Started');
      await this.seeder.seedAll();
      this.logger.log('Seeding Complete');
    }
  }
}
