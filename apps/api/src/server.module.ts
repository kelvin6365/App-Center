import {
  ConsoleLogger,
  Logger,
  MiddlewareConsumer,
  Module,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppExceptionFilter } from './common/exceptionFilters/all.exception.filter';
import { LoggerMiddleware } from './common/util/logger.middleware';
import { validate } from './common/util/env.validation';
import appConfig from './common/config/app.config';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import DatabaseModule from './database/database.module';
import HealthController from './modules/health/health.controller';
import { FileModule } from './modules/file/file.module';
import { SettingModule } from './modules/setting/setting.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { AuthModule } from './modules/auth/auth.module';
import { CredentialModule } from './modules/credential/credential.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { PortalModule } from './modules/portal/portal.module';
import { PlanModule } from './modules/plan/plan.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { AppModule } from './modules/app/app.module';

@Module({
  imports: [
    TerminusModule.forRoot({
      logger: ConsoleLogger,
      errorLogStyle: 'pretty',
    }),
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
    TenantModule,
    PortalModule,
    PlanModule,
    StripeModule,
  ],
  controllers: [HealthController],
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
})
export class ServerModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
