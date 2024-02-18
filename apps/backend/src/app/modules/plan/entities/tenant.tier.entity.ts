import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Plan } from '@/modules/plan/entities/plan.entity';
// id
// name
// max_tenants
// price
@Entity('tenant_tiers')
export class TenantTier extends BaseEntity {
  @Column()
  name: string;

  @Column()
  maxTenants: number;

  @OneToMany(() => Plan, (plan) => plan.tenantTier)
  plans: Plan[];
}
