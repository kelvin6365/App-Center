import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Subscription } from '../../plan/entities/subscription.entity';
import { UserStatus } from '../enum/user.status.enum';
import { UserPermission } from './user.permission.entity';
import { UserProfile } from './user.profile.entity';
import { UserProvider } from './user.provider.entity';
import { UserRefreshToken } from './user.refresh.token.entity';
import { UserRole } from './user.role.entity';
import { UserTenant } from './user.tenant.entity';

@Entity('user')
export class User extends BaseEntity {
  @Column({
    unique: true,
  })
  username: string;

  @Column({
    name: 'stripe_customer_id',
    nullable: true,
  })
  stripeCustomerId: string;

  @Column({
    select: false,
    nullable: true,
  })
  @Exclude()
  password: string;

  @Column({ nullable: true, name: 'ref_id' })
  refId: string;

  @Column({ default: UserStatus.Inactive, type: 'varchar' })
  status: UserStatus;

  @OneToOne(() => UserRefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
    eager: true,
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
    },
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

  @OneToMany(() => Subscription, (subscription) => subscription.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'id' })
  subscriptions: Subscription[];

  @OneToMany(() => UserProvider, (userProvider) => userProvider.user, {
    cascade: true,
  })
  providers: UserProvider[];
}
