import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('credential_components')
export class CredentialComponent extends BaseEntity {
  @Column()
  label: string;
  @Column()
  name: string;
  @Column()
  version: number;
  @Column({ type: 'jsonb' })
  inputs: Record<string, unknown>[];
}
