import { ApiProperty } from '@nestjs/swagger';
import { AppVersionTag } from '../entities/app.version.tag.entity';

export class AppVersionTagDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  appId: string;

  constructor(data: Partial<AppVersionTag>) {
    this.id = data.id;
    this.name = data.name;
    this.createdAt = data.createdAt;
    this.appId = data.appId;
  }
}
