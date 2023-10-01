import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { JiraUtil } from './jira.util';

@Injectable()
export class JiraService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly jiraUtil: JiraUtil
  ) {
    this.logger = new Logger(JiraService.name);
  }

  async searchJiraIssues(
    query: string,
    encryptedData: {
      jiraProjectKey: string;
      jiraUsername: string;
      jiraAPIToken: string;
      jiraHost: string;
    }
  ): Promise<
    {
      id: string;
      key: string;
      keyHtml: string;
      img: string;
      summary: string;
      summaryText: string;
    }[]
  > {
    this.logger.log('Searching jira issues for ' + query);
    const res = await this.jiraUtil.searchJiraIssues(
      query,
      encryptedData.jiraProjectKey,
      {
        username: encryptedData.jiraUsername,
        password: encryptedData.jiraAPIToken,
      },
      encryptedData.jiraHost
    );
    return this.jiraUtil.getCurrentSearchFromResponse(res.data);
  }

  async getJiraIssue(
    issueIdOrKey: string,
    encryptedData: {
      jiraProjectKey: string;
      jiraUsername: string;
      jiraAPIToken: string;
      jiraHost: string;
    }
  ) {
    const res = await this.jiraUtil.getJiraIssue(
      issueIdOrKey,
      {
        username: encryptedData.jiraUsername,
        password: encryptedData.jiraAPIToken,
      },
      encryptedData.jiraHost
    );
    return res.data;
  }
}
