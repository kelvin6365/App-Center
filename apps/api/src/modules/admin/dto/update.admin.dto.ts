import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create.admin.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AdminStatus } from '../enum/admin.status.enum';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @ApiProperty({ enum: AdminStatus })
  @IsEnum(AdminStatus)
  @IsOptional()
  status: AdminStatus;
}
