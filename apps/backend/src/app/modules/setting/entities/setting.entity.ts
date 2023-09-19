import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('setting')
export class Setting extends BaseEntity {
  @Column({ default: 'PRIVATE' })
  type: string;

  @Column({ unique: true })
  key: string;

  @Column({ type: 'jsonb' })
  config: Record<string, unknown>;

  @Column({ default: false })
  isSystemConfig: boolean;
}
