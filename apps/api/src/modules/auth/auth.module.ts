import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtPublicTokenStrategy } from './jwt.public.token.strategy';
import { JwtRefreshTokenStrategy } from './jwt.refresh.token.strategy';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UserModule } from '../user/user.module';
import { AuthGithubController } from './auth.github.controller';
import { GithubAuthService } from './provider/github.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: `${configService.get<number>(
            'jwt.user.accessTokenExpiresIn',
          )}${configService.get<number>('jwt.user.timeFormats')}`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, AuthGithubController],
  providers: [
    Logger,
    AuthService,
    GithubAuthService,
    LocalStrategy,
    JwtStrategy,
    JwtPublicTokenStrategy,
    JwtRefreshTokenStrategy,
  ],
  exports: [AuthService, GithubAuthService],
})
export class AuthModule {}
