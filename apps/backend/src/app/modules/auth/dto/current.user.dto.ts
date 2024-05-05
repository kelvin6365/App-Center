import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { UserRole } from '../../user/entities/user.role.entity';
import { UserStatus } from '../../user/enum/user.status.enum';
import { UserPermission } from '../../user/entities/user.permission.entity';
import { UserTenant } from '../../user/entities/user.tenant.entity';
import { Subscription } from '../../plan/entities/subscription.entity';
import moment from 'moment';

export class CurrentUserDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  username: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  stripeCustomerId: string;

  @ApiProperty({ type: UserStatus })
  status: UserStatus;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty({ type: UserRole, isArray: true })
  roles: UserRole[];

  @ApiProperty({ type: UserPermission, isArray: true })
  permissions: UserPermission[];

  @ApiProperty()
  tenants: UserTenant[];

  @ApiProperty()
  subscriptions: Subscription[];

  fromEntity(entity: User) {
    const dto = new CurrentUserDTO();
    dto.id = entity.id;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.email = entity.profile.email;
    dto.username = entity.username;
    dto.deletedAt = entity.deletedAt;
    dto.status = entity.status;
    dto.roles = entity.roles;
    dto.name = entity.profile.name;
    dto.permissions = entity.permissions;
    //filter deleted tenants
    dto.tenants = entity.tenants.filter((t) => !t.tenant.deletedAt);
    dto.stripeCustomerId = entity.stripeCustomerId;
    //filter active and not expired subscription
    dto.subscriptions = entity.subscriptions.filter(
      (s) =>
        s.status === 'active' && s.currentPeriodEnd > moment().utc().toDate()
    );
    return dto;
  }
}
