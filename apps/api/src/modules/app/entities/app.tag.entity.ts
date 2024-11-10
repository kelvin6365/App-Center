import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { App } from './app.entity';

@Entity('app_tags')
export class AppTag extends BaseEntity {
  @Column({ name: 'app_id', type: 'uuid' })
  appId: string;

  @Column({})
  name: string;

  @ManyToOne(() => App, (app) => app.tags)
  @JoinColumn({ name: 'app_id', referencedColumnName: 'id' })
  app: App;
}
