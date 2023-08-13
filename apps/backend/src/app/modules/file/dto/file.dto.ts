import { ApiProperty } from '@nestjs/swagger';
import { FileStatus } from '../enum/file.status.enum';
import { File } from '../entities/file.entity';
export class FileDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  contentType: string;
  @ApiProperty()
  extension: string;

  @ApiProperty()
  status: FileStatus;

  constructor(partial: Partial<File>) {
    this.id = partial.id;
    this.key = partial.key;
    this.contentType = partial.contentType;
    this.extension = partial.extension;
    this.status = FileStatus[partial.status];
    this.name = partial.name;
  }
}
