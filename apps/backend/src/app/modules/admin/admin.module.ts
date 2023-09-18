import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminRepository } from '../../database/repositories/admin.repository';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtAdminStrategy } from '../auth/admin/jwt.admin.strategy';
import { LocalAdminStrategy } from '../auth/admin/local.admin.strategy';
@Module({
  imports: [
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
  controllers: [AdminController],
  providers: [
    Logger,
    LocalAdminStrategy,
    JwtAdminStrategy,
    AdminService,
    AdminRepository,
  ],
  exports: [AdminService],
})
export class AdminModule {}
