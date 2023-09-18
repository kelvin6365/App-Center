import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { UserRole } from '../../user/entities/user.role.entity';
import { UserStatus } from '../../user/enum/user.status.enum';
import { UserPermission } from '../../user/entities/user.permission.entity';

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

  @ApiProperty({ type: UserStatus })
  status: UserStatus;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty({ type: UserRole, isArray: true })
  roles: UserRole[];

  @ApiProperty({ type: UserPermission, isArray: true })
  permissions: UserPermission[];

  @ApiProperty()
  tenants: string[];

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
    dto.tenants = entity.tenants?.map((tenant) => tenant.tenantId);
    return dto;
  }
}
