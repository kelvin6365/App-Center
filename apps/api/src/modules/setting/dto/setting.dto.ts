import { ApiProperty } from '@nestjs/swagger';
import { Setting } from '../entities/setting.entity';
export class SettingDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  config: Record<string, unknown>;

  constructor(partial: Partial<Setting>) {
    this.id = partial.id;
    this.key = partial.key;
    this.config = partial.config;
  }
}
