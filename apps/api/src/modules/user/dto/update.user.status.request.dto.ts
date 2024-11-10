import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../enum/user.status.enum';
import { IsEnum } from 'class-validator';

export class UpdateUserStatusRequestDTO {
  @ApiProperty({ enum: UserStatus })
  @IsEnum(UserStatus)
  status: UserStatus;
}
