import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import appConfig from './common/config/app.config';
import { AppExceptionFilter } from './common/exceptionFilters/all.exception.filter';
import { validate } from './common/util/env.validation';
import { LoggerMiddleware } from './common/util/logger.middleware';
import DatabaseModule from './database/database.module';
import { AppModule } from './modules/app/app.module';
import { RolesGuard } from './modules/auth/admin-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { CredentialModule } from './modules/credential/credential.module';
import { FileModule } from './modules/file/file.module';
import { RoleModule } from './modules/role/role.module';
import { SettingModule } from './modules/setting/setting.module';
import { UserModule } from './modules/user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validate,
    }),
    DatabaseModule,
    AppModule,
    FileModule,
    SettingModule,
    UserModule,
    RoleModule,
    AuthModule,
    CredentialModule,
  ],
  controllers: [],
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class ServerModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
