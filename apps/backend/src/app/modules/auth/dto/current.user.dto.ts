import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { UserRole } from '../../user/entities/user.role.entity';
import { UserStatus } from '../../user/enum/user.status.enum';

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
    return dto;
  }
}
