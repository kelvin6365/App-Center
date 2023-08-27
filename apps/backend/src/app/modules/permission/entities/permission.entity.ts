import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { UserPermission } from '../../user/entities/user.permission.entity';

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({})
  type: string;

  @OneToMany(
    () => UserPermission,
    (userPermission) => userPermission.permission
  )
  userPermissions: UserPermission[];
}
