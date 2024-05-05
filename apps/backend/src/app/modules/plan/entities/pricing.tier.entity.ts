import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Plan } from './plan.entity';

@Entity('pricing_tiers')
export class PricingTiers extends BaseEntity {
  @Column({
    name: 'plan_id',
  })
  planId: string;

  @Column({
    name: 'billing_cycle',
  })
  billingCycle: string;

  @Column({
    name: 'lookup_key',
    nullable: true,
  })
  lookupKey: string;

  @Column()
  price: number;

  @Column('decimal', {
    precision: 5,
    scale: 2,
    nullable: true,
    name: 'discount_percentage',
  })
  discountPercentage: number | null;

  @Column({ nullable: true, name: 'stripe_plan_id' })
  stripePlanId: string;

  //Plan
  @ManyToOne(() => Plan, (plan) => plan.pricingTiers)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;
}
