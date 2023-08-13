import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateSettingDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  key: string;
  @ApiProperty()
  @IsObject()
  config: Record<string, unknown>;
}
