import { NestFactory } from '@nestjs/core';
import { DatabaseSeeder } from './database-seeder/database-seeder.service';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmConnectionModule } from './database/typeorm-root.module';
import { DatabaseModule } from './database/database.module';
import { DatabaseSeedingModule } from './database-seeder/database-seeder.module';

@Module({
  imports: [TypeOrmConnectionModule, DatabaseModule, DatabaseSeedingModule],
})
class SeedModule {}

async function seed() {
  const app = await NestFactory.create(SeedModule);
  const seeder = app.get(DatabaseSeeder);
  const logger = new Logger('Seeding Task');
  logger.log('Seeding started');
  await seeder.seedAll();
  logger.log('Seeding Finished');
}

seed();
