import { ApiProperty } from '@nestjs/swagger';
import { maskingString } from '../../../common/util/util';

export class AppDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  apiKey: string;
  @ApiProperty()
  iconFileId: string;
  @ApiProperty()
  iconFileURL: string;
  @ApiProperty()
  extra: Record<string, unknown>;

  constructor(data: Partial<AppDTO>, iconFileURL: string) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.apiKey = maskingString(data.apiKey, 4, data.apiKey.length);
    this.iconFileId = data.iconFileId;
    this.iconFileURL = iconFileURL;
    this.extra = data.extra;
  }
}
