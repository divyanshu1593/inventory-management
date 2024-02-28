import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllEntities } from './database';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/config.env';
import { AppConfigService } from './config/config.service';
import { DatabaseModule } from './database/database.module';
import { DatabaseSeedingModule } from './database-seeder/database-seeder.module';
import { DatabaseSeeder } from './database-seeder/database-seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot({ validate }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite3',
      entities: AllEntities,
      synchronize: true,
    }),
    DatabaseModule,
    DatabaseSeedingModule,
  ],
  controllers: [AppController],
  // TODO: check re-exporting of AppConfigService
  providers: [AppService, AppConfigService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private readonly seeder: DatabaseSeeder,
    private readonly config: AppConfigService,
  ) {}
  async onApplicationBootstrap() {
    // seed everything on app start
    if (this.config.get('SEED')) await this.seeder.seedAll();
  }
}
