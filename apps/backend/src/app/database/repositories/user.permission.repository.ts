import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { UserPermission } from '../../modules/user/entities/user.permission.entity';
import AppsPermission from '../../modules/permission/enum/apps.permission.enum';

@Injectable()
export class UserPermissionRepository extends Repository<UserPermission> {
  constructor(dataSource: DataSource) {
    super(UserPermission, dataSource.createEntityManager());
  }

  //Add user permissions
  async addPermissions(
    permissions: UserPermission[]
  ): Promise<UserPermission[]> {
    return this.save(permissions);
  }

  //checks if user have any permissions or not
  async findPermissionsByUser(userId: string): Promise<UserPermission[]> {
    return await this.find({
      where: {
        userId: userId,
      },
    });
  }

  async softDeleteByUserIdAndAppId(
    userId: string,
    appId: string,
    targetPermissionIds: AppsPermission[],
    updatedBy?: string
  ) {
    if (updatedBy) {
      await this.update(
        {
          userId,
          refId: appId,
          permissionId: In(targetPermissionIds),
        },
        { updatedBy }
      );
    }
    return await this.softDelete({
      userId,
      refId: appId,
      permissionId: In(targetPermissionIds),
    });
  }
}
