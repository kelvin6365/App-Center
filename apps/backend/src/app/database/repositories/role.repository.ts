import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Role } from '../../modules/role/entities/role.entity';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }
  getRoleById(roleId: string, withDeleted = false): Promise<Role> {
    return this.findOne({
      where: { id: roleId },
      withDeleted,
    });
  }

  findAllWithDeleteFalse(): Promise<Role[]> {
    return this.find({
      withDeleted: false,
    });
  }

  createRole(role: Role): Promise<Role> {
    return this.save(role);
  }
}
