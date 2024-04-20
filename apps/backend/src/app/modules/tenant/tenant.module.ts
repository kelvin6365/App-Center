import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TenantRepository } from '../../database/repositories/tenant.repository';
import { TenantUtil } from './tenant.util';

@Module({
  controllers: [TenantController],
  providers: [TenantService, TenantRepository, TenantUtil],
  exports: [TenantService],
})
export class TenantModule {}
