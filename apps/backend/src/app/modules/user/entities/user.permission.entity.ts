import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Permission } from '../../permission/entities/permission.entity';

@Entity('user_permission')
export class UserPermission extends BaseEntity {
  @Column({ name: 'user_id', unique: false })
  userId: string;
  @Column({ name: 'permission_id', unique: false })
  permissionId: string;

  @ManyToOne(() => Permission, (permission) => permission.userPermissions, {
    eager: true,
  })
  @JoinColumn({ name: 'permission_id', referencedColumnName: 'id' })
  permission: Permission;

  @Column({ name: 'ref_id', type: 'uuid', nullable: true })
  refId: string;

  @ManyToOne(() => User, (user: User) => user.roles)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
