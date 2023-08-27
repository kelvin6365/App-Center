import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App } from '../modules/app/entities/app.entity';
import { AppVersion } from '../modules/app/entities/app.version.entity';
import { File } from '../modules/file/entities/file.entity';
import { AppTag } from '../modules/app/entities/app.tag.entity';
import { AppVersionTag } from '../modules/app/entities/app.version.tag.entity';
import { Setting } from '../modules/setting/entities/setting.entity';
import { User } from '../modules/user/entities/user.entity';
import { UserProfile } from '../modules/user/entities/user.profile.entity';
import { UserRefreshToken } from '../modules/user/entities/user.refresh.token.entity';
import { Role } from '../modules/role/entities/role.entity';
import { UserRole } from '../modules/user/entities/user.role.entity';
import { role1671277071496 } from './migrations/1671277071496-role';

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
          entities: [
            App,
            AppVersion,
            AppTag,
            AppVersionTag,
            File,
            Setting,
            User,
            UserProfile,
            UserRefreshToken,
            Role,
            UserRole,
          ],
          synchronize: configService.get('db.synchronize'),
          migrations: [role1671277071496],
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
