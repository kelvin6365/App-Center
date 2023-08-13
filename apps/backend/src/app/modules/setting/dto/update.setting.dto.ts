import { ApiProperty } from '@nestjs/swagger';
import { CreateSettingDTO } from './create.setting.dto';
import { IsUUID } from 'class-validator';

export class UpdateSettingDTO extends CreateSettingDTO {
  @ApiProperty()
  @IsUUID('4')
  id: string;
}
