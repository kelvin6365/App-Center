import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtPublicTokenStrategy } from '../auth/jwt.public.token.strategy';
import { JwtRefreshTokenStrategy } from '../auth/jwt.refresh.token.strategy';
import { JwtStrategy } from '../auth/jwt.strategy';
import { LocalStrategy } from '../auth/local.strategy';
import { UserModule } from '../user/user.module';
import { PortalUserController } from './portal.user.controller';
import { AuthModule } from '../auth/auth.module';
import { PortalSettingController } from './portal.setting.controller';
import { SettingModule } from '../setting/setting.module';
import { PortalAppController } from './portal.app.controller';
import { FileModule } from '../file/file.module';
import { AppModule } from '../app/app.module';
import { CredentialModule } from '../credential/credential.module';
import { PortalCredentialController } from './portal.credential.controller';
import { PortalTestController } from './test.controller';
import { JiraModule } from '../jira/jira.module';
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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: `${configService.get<number>(
            'jwt.user.accessTokenExpiresIn'
          )} Days`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    PortalUserController,
    PortalSettingController,
    PortalAppController,
    PortalCredentialController,
    PortalTestController,
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
