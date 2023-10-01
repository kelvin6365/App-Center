import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { App } from './app.entity';
import { AppVersionTag } from './app.version.tag.entity';
import { File } from '../../file/entities/file.entity';
import { AppVersionJiraIssue } from './app.version.jira.issue.entity';

@Entity('app_versions')
export class AppVersion extends BaseEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'file_id', nullable: true })
  fileId: string;

  @Column({ name: 'app_id' })
  appId: string;

  @ManyToOne(() => App, (app) => app.versions)
  @JoinColumn({ name: 'app_id', referencedColumnName: 'id' })
  app: App;

  @OneToMany(() => AppVersionTag, (appVersionTag) => appVersionTag.appVersion, {
    cascade: true,
  })
  tags: AppVersionTag[];

  @Column({ name: 'install_password', nullable: true })
  installPassword: string;

  @OneToOne(() => File, (file) => file.appVersion)
  @JoinColumn({ name: 'file_id', referencedColumnName: 'id' })
  file: File;

  @OneToMany(
    () => AppVersionJiraIssue,
    (appVersionJiraIssue) => appVersionJiraIssue.appVersion,
    {
      cascade: true,
      eager: true,
    }
  )
  jiraIssues: AppVersionJiraIssue[];
}
