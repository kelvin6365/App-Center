import { Injectable } from '@nestjs/common';
import { Repository, DataSource, UpdateResult } from 'typeorm';
import { AppVersionJiraIssue } from '../../modules/app/entities/app.version.jira.issue.entity';
import { AppException } from '../../common/response/app.exception';
import { ResponseCode } from '../../common/response/response.code';

@Injectable()
export class AppVersionJiraIssueRepository extends Repository<AppVersionJiraIssue> {
  constructor(dataSource: DataSource) {
    super(AppVersionJiraIssue, dataSource.createEntityManager());
  }

  //delete jira issue by issue id and app version id
  async deleteJiraIssueByIssueIdAndAppVersionId(
    id: string,
    appVersionId: string,
    updatedBy: string
  ): Promise<UpdateResult> {
    const target = await this.findOne({
      where: { id, appVersionId },
      withDeleted: false,
    });
    if (!target) throw new AppException(ResponseCode.STATUS_1011_NOT_FOUND);
    target.updatedBy = updatedBy;
    return await this.manager.transaction(async (em) => {
      await em.save(target);
      return await em.softDelete(AppVersionJiraIssue, { id: target.id });
    });
  }
}
