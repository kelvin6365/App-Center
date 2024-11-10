import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { join } from 'path';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import appConfig from './app.config';

dotenv.config({ path: join(__dirname, '../../../.env') });
const configService = new ConfigService(appConfig());
const options: DataSourceOptions = {
  type: 'postgres',
  entities: [
    join(__dirname, '../../database/**/*.entity{.ts,.js}'),
    join(__dirname, '../../modules/**/*.entity{.ts,.js}'),
  ],
  migrations: [join(__dirname, '../../database/migrations/scripts/*.ts')],
  synchronize: configService.get('db.synchronize'),
  migrationsRun: configService.get('db.migrationsRun'),
  logging: configService.get('db.logging'),
  database: configService.get('db.database'),
  url: configService.get('db.url'),
};
export const AppDataSource = new DataSource(options);
