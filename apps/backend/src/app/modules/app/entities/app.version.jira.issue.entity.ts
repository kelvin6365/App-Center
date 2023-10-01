import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { AppVersion } from './app.version.entity';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('app_version_jira_issues')
export class AppVersionJiraIssue extends BaseEntity {
  @Column({ name: 'app_version_id', type: 'uuid' })
  appVersionId: string;

  @Column({})
  issueIdOrKey: string;

  @ManyToOne(() => AppVersion, (appVersion) => appVersion.jiraIssues)
  @JoinColumn({ name: 'app_version_id', referencedColumnName: 'id' })
  appVersion: AppVersion;
}
