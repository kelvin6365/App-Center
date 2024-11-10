import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import AppsPermission from '../../permission/enum/apps.permission.enum';

export class AddUserRequestDTO {
  @ApiProperty()
  @IsUUID()
  appId: string;
  @ApiProperty()
  @IsEnum(AppsPermission, { each: true })
  @IsUUID(undefined, { each: true })
  permissions: AppsPermission[];
}
