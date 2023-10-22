import { Logger, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRefreshTokenRepository } from '../../database/repositories/user.refresh.token.repository';
import { UserRepository } from '../../database/repositories/users.repository';
import { UserPermissionRepository } from '../../database/repositories/user.permission.repository';
import { UserUtil } from './user.util';

@Module({
  controllers: [UserController],
  providers: [
    Logger,
    UserService,
    UserRefreshTokenRepository,
    UserRepository,
    UserPermissionRepository,
    UserUtil,
  ],
  exports: [UserService],
})
export class UserModule {}
