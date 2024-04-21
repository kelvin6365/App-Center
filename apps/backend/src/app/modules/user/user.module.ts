import { Logger, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRefreshTokenRepository } from '../../database/repositories/user.refresh.token.repository';
import { UserRepository } from '../../database/repositories/users.repository';
import { UserPermissionRepository } from '../../database/repositories/user.permission.repository';
import { UserUtil } from './user.util';
import { TenantRepository } from '@/database/repositories/tenant.repository';
import { UserTenantRepository } from '@/database/repositories/user.tenent.repository';
import { TenantUtil } from '@/modules/tenant/tenant.util';
import { TenantService } from '../tenant/tenant.service';
import { UserRoleRepository } from '../../database/repositories/user.role.repository';

@Module({
  controllers: [UserController],
  providers: [
    Logger,
    UserService,
    UserRefreshTokenRepository,
    UserRepository,
    UserPermissionRepository,
    TenantRepository,
    UserTenantRepository,
    UserRoleRepository,
    TenantService,
    UserUtil,
    TenantUtil,
  ],
  exports: [UserService],
})
export class UserModule {}
