import { Controller, Get } from '@nestjs/common';
import { JiraService } from '../jira/jira.service';

@Controller({ path: '/portal/test', version: ['1'] })
export class PortalTestController {
  constructor(private readonly jiraService: JiraService) {}

  //   @Get('')
  //   async test() {
  //     return await this.jiraService.searchJiraIssues();
  //   }
}
