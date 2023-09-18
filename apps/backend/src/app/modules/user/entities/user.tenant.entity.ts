import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Tenant } from '../../tenant/entities/tenant.entity';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('user_tenants')
export class UserTenant extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  // Relations
  @ManyToOne(() => User, (user: User) => user.tenants)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Tenant, (tenant: Tenant) => tenant.users)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
