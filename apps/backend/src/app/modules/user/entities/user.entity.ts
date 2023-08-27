import { Exclude } from 'class-transformer';
import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { UserStatus } from '../enum/user.status.enum';
import { UserRefreshToken } from './user.refresh.token.entity';
import { UserRole } from './user.role.entity';
import { UserProfile } from './user.profile.entity';

@Entity('user')
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true, name: 'ref_id' })
  refId: string;

  @Column({ default: UserStatus.INACTIVE, type: 'varchar' })
  status: UserStatus;

  @OneToOne(() => UserRefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  refreshToken: UserRefreshToken;

  @OneToMany(() => UserRole, (userRole: UserRole) => userRole.user, {
    cascade: true,
  })
  roles: UserRole[];

  @OneToOne(() => UserProfile, (profile) => profile.user, {
    cascade: true,
  })
  profile: UserProfile;
}
