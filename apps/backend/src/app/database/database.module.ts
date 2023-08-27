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
import { role1693123446948 } from './migrations/1693123446948-role';
import { Role1693123446947 } from './migrations/1693123446947-create-role';
import { Permission } from '../modules/permission/entities/permission.entity';
import { UserPermission } from '../modules/user/entities/user.permission.entity';
import { Permission1693145873440 } from './migrations/1693145873440-permission';
import { PermissionInsert1693145971058 } from './migrations/1693145971058-permission-insert';

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
            Permission,
            UserPermission,
          ],
          synchronize: configService.get('db.synchronize'),
          migrations: [
            Role1693123446947,
            role1693123446948,
            Permission1693145873440,
            PermissionInsert1693145971058,
          ],
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
