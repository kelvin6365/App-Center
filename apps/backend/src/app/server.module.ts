import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppModule } from './modules/app/app.module';
import { FileModule } from './modules/file/file.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './common/config/app.config';
import DatabaseModule from './database/database.module';
import { LoggerMiddleware } from './common/util/logger.middleware';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AppExceptionFilter } from './common/exceptionFilters/all.exception.filter';
import { SettingModule } from './modules/setting/setting.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { RolesGuard } from './modules/auth/admin-auth.guard';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { CredentialModule } from './modules/credential/credential.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      // validationSchema: Joi.object({
      //   PORT: Joi.string().required(),
      //   TYPEORM_SYNCHRONIZE: Joi.boolean().required(),
      //   TYPEORM_LOGGING: Joi.boolean().required(),
      //   TYPEORM_MIGRATIONS_RUN: Joi.boolean().required(),
      //   SWAGGER_PATH: Joi.string().required(),
      //   DB_CONNECTION_TIMEOUT_MILLS: Joi.string().required(),
      //   JWT_SECRET: Joi.string().required(),
      //   GCP_BUCKET_NAME: Joi.string().required(),
      //   GOOGLE_CREDENTIALS: Joi.optional(),
      //   GOOGLE_APPLICATION_CREDENTIALS: Joi.optional(),
      //   API_KEY: Joi.string().required(),
      //   REDIS_URL: Joi.string().required(),
      //   PUBLIC_FILE_URL: Joi.string().required(),
      //   SENDGRID_API_KEY: Joi.string().required(),
      //   INFO_SENDER_EMAIL: Joi.string().required(),
      //   // WEB_EMAIL_VERIFY_URL: Joi.string().required(),
      //   // STREAM_APP_ID: Joi.string().required(),
      //   // STREAM_KEY: Joi.string().required(),
      //   // STREAM_SECRET: Joi.string().required(),
      //   // PUBLIC_FILE_URL: Joi.string().required(),
      // }),
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
