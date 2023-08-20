import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { AppVersion } from '../../app/entities/app.version.entity';
import { FileStatus } from '../enum/file.status.enum';

@Entity('files')
export class File extends BaseEntity {
  @Column({ name: 'content_type' })
  contentType: string;

  @Column({ nullable: true })
  key: string;

  @Column({ nullable: true })
  name: string;

  @Column({})
  type: string;

  @Column({ default: FileStatus.PENDING })
  status: string;

  @Column({})
  extension: string;

  @OneToOne(() => AppVersion, (appVersion) => appVersion.file)
  appVersion: AppVersion;

  @Column({ default: false })
  isPublic: boolean;
}
