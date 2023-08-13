import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App } from '../modules/app/entities/app.entity';
import { AppVersion } from '../modules/app/entities/app.version.entity';
import { File } from '../modules/file/entities/file.entity';
import { AppTag } from '../modules/app/entities/app.tag.entity';
import { AppVersionTag } from '../modules/app/entities/app.version.tag.entity';
import { Setting } from '../modules/setting/entities/setting.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          database: configService.get('db.database'),
          url: configService.get('db.url'),
          entities: [App, AppVersion, AppTag, AppVersionTag, File, Setting],
          synchronize: configService.get('db.synchronize'),
          migrationsRun: configService.get('db.migrationsRun'),
          logging: configService.get('db.logging'),
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
class DatabaseModule {}

export default DatabaseModule;
