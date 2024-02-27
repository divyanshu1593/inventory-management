import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllEntities } from '.';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: AllEntities,
      synchronize: true,
    }),
  ],
})
export class DatabaseTestModule {}
