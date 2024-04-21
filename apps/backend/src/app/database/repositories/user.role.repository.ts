import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserRole } from '../../modules/user/entities/user.role.entity';

@Injectable()
export class UserRoleRepository extends Repository<UserRole> {
  constructor(dataSource: DataSource) {
    super(UserRole, dataSource.createEntityManager());
  }

  createUserRole(userRole: UserRole): Promise<UserRole> {
    return this.save(userRole);
  }

  findUserRoleByUserIdAndTenantId(userId: string, tenantId: string) {
    return this.findOne({
      where: {
        userId,
        tenantId,
      },
    });
  }

  updateUserRole(userRole: UserRole): Promise<UserRole> {
    return this.save(userRole);
  }
}
