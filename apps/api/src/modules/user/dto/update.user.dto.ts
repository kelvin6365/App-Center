import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { RoleType } from '../../role/enum/role.type.enum';

export class UpdateUserDTO {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @ValidateIf((data) => data.password)
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(RoleType)
  role: RoleType;
}
