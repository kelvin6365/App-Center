import { join } from 'path';
// import * as dotenv from 'dotenv';
// dotenv.config();
export class DBConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _config: any;
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config: any = {
      type: 'postgres',

      entities: [
        join(__dirname, 'src/database/entities', '**.entity{.ts,.js}'),
        join(__dirname, 'src/database/entities', '**.entity{.ts,.js}'),
      ],
      migrations: [
        join(__dirname, 'src/database/migrations/scripts', '*{.ts,.js}'),
      ],
      synchronize: process.env.TYPEORM_SYNCHRONIZE == 'true',
      migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN == 'true',
      logging: process.env.TYPEORM_LOGGING == 'true',
      connectTimeoutMS: process.env.DB_CONNECTION_TIMEOUT_MILLS,
      keepConnectionAlive: true,
      url: process.env.TYPEORM_URL,
    };

    this._config = config;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public get config(): any {
    return this._config;
  }
}
