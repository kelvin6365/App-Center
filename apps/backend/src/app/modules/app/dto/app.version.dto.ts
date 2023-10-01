import { ApiProperty } from '@nestjs/swagger';
import { AppVersion } from '../entities/app.version.entity';
import { AppVersionTagDTO } from './app.version.tag.dto';
import { FileDTO } from '../../file/dto/file.dto';
import { AppVersionJiraIssueDTO } from './app.version.jira.issue.dto';

export class AppVersionDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  fileId: string;
  @ApiProperty()
  fileURL: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  appId: string;

  @ApiProperty()
  file: FileDTO;

  @ApiProperty()
  tags: AppVersionTagDTO[];

  @ApiProperty()
  jiraIssues: AppVersionJiraIssueDTO[];

  constructor(data: Partial<AppVersion>, fileURL: string) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.fileId = data.fileId;
    this.fileURL = fileURL;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.tags = data.tags?.map((tag) => new AppVersionTagDTO(tag)) ?? [];
    this.file = data.file ? new FileDTO(data.file) : null;
    this.appId = data.appId;
    this.jiraIssues =
      data.jiraIssues?.map((issue) => new AppVersionJiraIssueDTO(issue)) ?? [];
  }
}
