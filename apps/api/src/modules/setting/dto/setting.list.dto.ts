import { ApiProperty } from '@nestjs/swagger';
import { SettingDTO } from './setting.dto';

export class SettingListDTO {
  @ApiProperty({ type: SettingDTO, isArray: true })
  settings: SettingDTO[];
  constructor(partial: Partial<SettingDTO[]>) {
    this.settings = partial;
  }
}
