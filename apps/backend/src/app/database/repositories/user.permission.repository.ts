import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserPermission } from '../../modules/user/entities/user.permission.entity';

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
}
