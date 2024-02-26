import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AllEntities } from '.';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(AllEntities)],
  exports: [TypeOrmModule.forFeature(AllEntities)],
})
export class DatabaseModule {
  constructor(private readonly dataSource: DataSource) {}
}
