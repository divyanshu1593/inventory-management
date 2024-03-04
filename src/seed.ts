import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseSeeder } from './database-seeder/database-seeder.service';
import { Logger } from '@nestjs/common';

async function seed() {
  const app = await NestFactory.create(AppModule);
  const seeder = app.get(DatabaseSeeder);
  const logger = new Logger('Seeding Task');
  logger.log('Seeding started');
  await seeder.seedAll();
  logger.log('Seeding Finished');
}

seed();
