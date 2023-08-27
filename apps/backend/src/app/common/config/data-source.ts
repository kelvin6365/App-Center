import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { join } from 'path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import appConfig from './app.config';
dotenv.config({ path: join(__dirname, '..', '..', '../../.env') });
const configService = new ConfigService(appConfig());
export const AppDataSource = new DataSource({
  type: 'postgres',
  entities: [
    join(__dirname, 'src/app/database/entities', '**.entity{.ts,.js}'),
    join(__dirname, 'src/app/database/entities', '**.entity{.ts,.js}'),
  ],
  migrations: [join(__dirname, '../../database/migrations/*.ts')],
  synchronize: configService.get('db.synchronize'),
  migrationsRun: configService.get('db.migrationsRun'),
  logging: configService.get('db.logging'),
  database: configService.get('db.database'),
  url: configService.get('db.url'),
});
