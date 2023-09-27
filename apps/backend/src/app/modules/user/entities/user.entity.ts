import { Exclude } from 'class-transformer';
import { Entity, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { UserStatus } from '../enum/user.status.enum';
import { UserRefreshToken } from './user.refresh.token.entity';
import { UserRole } from './user.role.entity';
import { UserProfile } from './user.profile.entity';
import { UserPermission } from './user.permission.entity';
import { UserTenant } from './user.tenant.entity';

@Entity('user')
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column({
    select: false,
  })
  @Exclude()
  password: string;

  @Column({ nullable: true, name: 'ref_id' })
  refId: string;

  @Column({ default: UserStatus.Inactive, type: 'varchar' })
  status: UserStatus;

  @OneToOne(() => UserRefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  refreshToken: UserRefreshToken;

  @OneToMany(() => UserRole, (userRole: UserRole) => userRole.user, {
    cascade: true,
  })
  roles: UserRole[];

  @OneToMany(
    () => UserPermission,
    (userPermission: UserPermission) => userPermission.user,
    {
      cascade: true,
    }
  )
  permissions: UserPermission[];

  @OneToOne(() => UserProfile, (profile) => profile.user, {
    cascade: true,
  })
  profile: UserProfile;

  @OneToMany(() => UserTenant, (userTenant) => userTenant.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'id' })
  tenants: UserTenant[];
}
