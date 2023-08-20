import { ApiProperty } from '@nestjs/swagger';
import { AppDTO } from './app.dto';
import { AppVersionDTO } from './app.version.dto';

export class InstallAppDTO {
  @ApiProperty({ type: AppDTO })
  app: AppDTO;
  @ApiProperty({ type: AppVersionDTO })
  version: AppVersionDTO;

  constructor(app: AppDTO, version: AppVersionDTO) {
    this.app = app;
    this.version = version;
  }
}
