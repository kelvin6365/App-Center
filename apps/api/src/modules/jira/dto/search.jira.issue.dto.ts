import { ApiProperty } from '@nestjs/swagger';

export class SearchJiraIssueDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  key: string;
  @ApiProperty()
  keyHtml: string;
  @ApiProperty()
  img: string;
  @ApiProperty()
  summary: string;
  @ApiProperty()
  summaryText: string;

  constructor(
    partial: Partial<{
      id: string;
      key: string;
      keyHtml: string;
      img: string;
      summary: string;
      summaryText: string;
    }>
  ) {
    this.id = partial.id;
    this.key = partial.key;
    this.keyHtml = partial.keyHtml;
    this.img = partial.img;
    this.summary = partial.summary;
    this.summaryText = partial.summaryText;
  }
}
