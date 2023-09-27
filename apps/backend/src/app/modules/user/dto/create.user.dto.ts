import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import PermissionEnum from '../../permission/enum/permission.enum';
import { RoleType } from '../../role/enum/role.type.enum';
import { Transform } from 'class-transformer';
export class CreateUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(RoleType, { each: true })
  @IsArray()
  roleTypes: RoleType[];

  @ApiProperty()
  @IsOptional()
  @IsEnum(PermissionEnum, { each: true })
  @IsArray()
  @Transform(({ value: values }) =>
    values.map((value: string) => PermissionEnum[value])
  )
  permissions: PermissionEnum[];

  @ApiProperty()
  @ArrayNotEmpty()
  @IsUUID(undefined, { each: true })
  tenantIds: string[];
}
