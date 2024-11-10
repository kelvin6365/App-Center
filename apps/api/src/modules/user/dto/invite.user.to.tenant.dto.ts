import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { RoleType } from '../../role/enum/role.type.enum';

export class InviteUserToTenantDTO {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsEnum(RoleType)
  role: RoleType;
}
