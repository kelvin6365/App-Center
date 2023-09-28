import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { AppVersion } from './app.version.entity';
import { AppTag } from './app.tag.entity';

@Entity('apps')
export class App extends BaseEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'api_key' })
  apiKey: string;

  @Column({ name: 'icon_file_id', type: 'uuid', nullable: true })
  iconFileId: string;

  @Column({ name: 'extra', type: 'jsonb' })
  extra: Record<string, unknown>;

  @OneToMany(() => AppVersion, (appVersion) => appVersion.app, {
    cascade: true,
  })
  versions: AppVersion[];

  @OneToMany(() => AppTag, (appTag) => appTag.app, { cascade: true })
  tags: AppTag[];

  @Column({ name: 'tenant_id', type: 'uuid', nullable: false })
  tenantId: string;
}
