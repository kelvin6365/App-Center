import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { JiraGetIssueResponse } from './type/jira.get.issue.response';
@Injectable()
export class JiraUtil {
  constructor(private readonly httpService: HttpService) {}
  toJQL(projectKey: string) {
    return `project = "${projectKey}" ORDER BY priority DESC, updated DESC`;
  }

  //Search issues in Jira
  // {{protocol}}://{{host}}/{{basePath}}rest/api/3/issue/picker?query={{query}}&currentJQL={{currentJQL}}
  async searchJiraIssues(
    query: string,
    projectKey: string,
    auth: {
      username: string;
      password: string;
    },
    host: string
  ): Promise<
    AxiosResponse<{
      sections: {
        label: string;
        sub: string;
        id: string;
        issues: {
          id: string;
          key: string;
          keyHtml: string;
          img: string;
          summary: string;
          summaryText: string;
        }[];
      }[];
    }>
  > {
    console.log({
      query: query,
      currentJQL: this.toJQL(projectKey),
    });
    //fetch Jira API requests
    return await this.httpService.axiosRef.get(
      `https://${host}/rest/api/3/issue/picker`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${auth.username}:${auth.password}`
          ).toString('base64')}`,
        },
        params: {
          query: query,
          currentJQL: this.toJQL(projectKey),
        },
      }
    );
  }

  async getJiraIssue(
    issueIdOrKey: string,
    auth: {
      username: string;
      password: string;
    },
    host: string
  ): Promise<AxiosResponse<JiraGetIssueResponse>> {
    return await this.httpService.axiosRef.get(
      `https://${host}/rest/api/3/issue/${issueIdOrKey}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${auth.username}:${auth.password}`
          ).toString('base64')}`,
        },
      }
    );
  }

  getCurrentSearchFromResponse({
    sections,
  }: {
    sections: {
      label: string;
      sub: string;
      id: string;
      issues: {
        id: string;
        key: string;
        keyHtml: string;
        img: string;
        summary: string;
        summaryText: string;
      }[];
    }[];
  }): {
    id: string;
    key: string;
    keyHtml: string;
    img: string;
    summary: string;
    summaryText: string;
  }[] {
    return sections.find((session) => session.id === 'cs').issues;
  }
}
