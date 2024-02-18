import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { TenantTier } from '@/modules/plan/entities/tenant.tier.entity';
// id
// name
// tenant_tier_id
@Entity('plans')
export class Plan extends BaseEntity {
  @Column()
  name: string;

  @Column()
  stripePlanId: string;

  @Column()
  amountPerCycle: number;

  @ManyToOne(() => TenantTier)
  @JoinColumn({ name: 'tenant_tier_id' })
  tenantTier: TenantTier;
}
