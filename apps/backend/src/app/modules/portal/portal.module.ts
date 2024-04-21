import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppModule } from '../app/app.module';
import { AuthModule } from '../auth/auth.module';
import { JwtPublicTokenStrategy } from '../auth/jwt.public.token.strategy';
import { JwtRefreshTokenStrategy } from '../auth/jwt.refresh.token.strategy';
import { JwtStrategy } from '../auth/jwt.strategy';
import { LocalStrategy } from '../auth/local.strategy';
import { CredentialModule } from '../credential/credential.module';
import { FileModule } from '../file/file.module';
import { JiraModule } from '../jira/jira.module';
import { SettingModule } from '../setting/setting.module';
import { TenantModule } from '../tenant/tenant.module';
import { UserModule } from '../user/user.module';
import { PortalAppController } from './portal.app.controller';
import { PortalCredentialController } from './portal.credential.controller';
import { PortalSettingController } from './portal.setting.controller';
import { PortalTenantController } from './portal.tenant.controller';
import { PortalUserController } from './portal.user.controller';
import { PortalTestController } from './test.controller';
@Module({
  imports: [
    AuthModule,
    UserModule,
    SettingModule,
    FileModule,
    AppModule,
    CredentialModule,
    JiraModule,
    PassportModule,
    TenantModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('jwt.secret'),
          signOptions: {
            expiresIn: `${configService.get<number>(
              'jwt.user.accessTokenExpiresIn'
            )}${configService.get<number>('jwt.user.timeFormats')}`,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [
    PortalUserController,
    PortalSettingController,
    PortalAppController,
    PortalCredentialController,
    PortalTestController,
    PortalTenantController,
  ],
  providers: [
    Logger,
    LocalStrategy,
    JwtStrategy,
    JwtPublicTokenStrategy,
    JwtRefreshTokenStrategy,
  ],
  exports: [],
})
export class PortalModule {}
