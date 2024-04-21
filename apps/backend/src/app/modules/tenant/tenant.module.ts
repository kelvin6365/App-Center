import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TenantRepository } from '../../database/repositories/tenant.repository';
import { TenantUtil } from './tenant.util';
import { UserTenantRepository } from '../../database/repositories/user.tenent.repository';
import { UserRoleRepository } from '../../database/repositories/user.role.repository';

@Module({
  controllers: [TenantController],
  providers: [
    TenantService,
    TenantRepository,
    UserTenantRepository,
    UserRoleRepository,
    TenantUtil,
  ],
  exports: [TenantService],
})
export class TenantModule {}
