import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Not, Repository } from 'typeorm';
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

  findUserRoleByTenantIdAndRoleIdNotIncludeUserId(
    userId: string,
    tenantId: string,
    roleId: string
  ) {
    return this.find({
      where: {
        tenantId,
        roleId,
        userId: Not(userId),
      },
    });
  }

  updateUserRole(userRole: UserRole): Promise<UserRole> {
    return this.save(userRole);
  }

  async removeUserRoleByUserIdAndTenantId(
    userId: string,
    tenantId: string,
    updatedBy: string
  ) {
    const userRole: UserRole = await this.findOne({
      where: {
        userId,
        tenantId,
      },
    });
    userRole.updatedBy = updatedBy;
    return await this.manager.transaction(async (em) => {
      try {
        await em.save(UserRole, userRole);
        await em.softRemove(UserRole, userRole);
      } catch (error) {
        throw new InternalServerErrorException('Failed to remove user role');
      }
    });
  }
}
