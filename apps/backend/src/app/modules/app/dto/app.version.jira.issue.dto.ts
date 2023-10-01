import { ApiProperty } from '@nestjs/swagger';
import { AppVersionJiraIssue } from '../entities/app.version.jira.issue.entity';

export class AppVersionJiraIssueDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  issueIdOrKey: string;
  @ApiProperty()
  iconUrl: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  summary: string;
  @ApiProperty()
  url: string;
  @ApiProperty()
  issueType: string;
  constructor(
    data: Partial<
      AppVersionJiraIssue & {
        issuetype: {
          name: string;
          iconUrl: string;
        };
        status: string;
        summary: string;
        url: string;
      }
    >
  ) {
    this.id = data.id;
    this.issueIdOrKey = data.issueIdOrKey;
    this.iconUrl = data.issuetype?.iconUrl;
    this.issueType = data.issuetype?.name;
    this.status = data.status;
    this.summary = data.summary;
    this.url = data.url;
  }
}
