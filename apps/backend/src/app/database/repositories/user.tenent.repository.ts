import { UserTenant } from '@/modules/user/entities/user.tenant.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserTenantRepository extends Repository<UserTenant> {
  constructor(dataSource: DataSource) {
    super(UserTenant, dataSource.createEntityManager());
  }

  createUserTenant(userTenant: UserTenant): Promise<UserTenant> {
    return this.save(userTenant);
  }

  async removeUserTenantByUserIdAndTenantId(
    userId: string,
    tenantId: string,
    updatedBy: string
  ) {
    const userTenant: UserTenant = await this.findOne({
      where: {
        userId,
        tenantId,
      },
    });
    userTenant.updatedBy = updatedBy;
    return await this.manager.transaction(async (em) => {
      try {
        await em.save(UserTenant, userTenant);
        await em.softRemove(UserTenant, userTenant);
      } catch (error) {
        throw new InternalServerErrorException('Failed to remove user tenant');
      }
    });
  }
}
