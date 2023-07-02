import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';

export default {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: true,
  synchronize: true,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
} as TypeOrmModuleOptions;
