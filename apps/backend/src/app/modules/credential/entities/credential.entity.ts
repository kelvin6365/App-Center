import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('credentials')
export class Credential extends BaseEntity {
  @Column()
  name: string;

  @Column()
  credentialName: string;

  @Column({ type: 'text' })
  encryptedData: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;
}
