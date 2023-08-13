import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { AppVersion } from './app.version.entity';

@Entity('app_version_tags')
export class AppVersionTag extends BaseEntity {
  @Column({ name: 'app_version_id', type: 'uuid' })
  appVersionId: string;

  @Column({ name: 'app_id', type: 'uuid' })
  appId: string;

  @Column({})
  name: string;

  @ManyToOne(() => AppVersion, (appVersion) => appVersion.tags)
  @JoinColumn({ name: 'app_version_id', referencedColumnName: 'id' })
  appVersion: AppVersion;
}
