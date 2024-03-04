import { TypeOrmModule } from '@nestjs/typeorm';
import { AllEntities } from '.';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite3',
      entities: AllEntities,
      synchronize: true,
    }),
  ],
})
export class TypeOrmConnectionModule {}
