import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { SettingType } from '../enum/setting.type.enum';

export class CreateSettingDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(SettingType)
  type: SettingType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  key: string;
  @ApiProperty()
  @IsObject()
  config: Record<string, unknown>;
}
