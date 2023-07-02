import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from 'src/config/ormconfig';

@Module({ imports: [TypeOrmModule.forRoot(ormconfig)] })
export class DatabaseModule {}
