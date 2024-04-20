import { UserTenant } from '@/modules/user/entities/user.tenant.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserTenantRepository extends Repository<UserTenant> {
  constructor(dataSource: DataSource) {
    super(UserTenant, dataSource.createEntityManager());
  }

  createUserTenant(userTenant: UserTenant): Promise<UserTenant> {
    return this.save(userTenant);
  }
}
