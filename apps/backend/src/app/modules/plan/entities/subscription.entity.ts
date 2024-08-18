import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Plan } from './plan.entity';
@Entity('subscriptions')
export class Subscription extends BaseEntity {
  @Column({
    name: 'stripe_subscription_id',
  })
  stripeSubscriptionId: string;
  @Column({
    name: 'stripe_customer_id',
  })
  stripeCustomerId: string;
  @Column({
    name: 'stripe_plan_id',
  })
  stripePlanId: string;

  @Column()
  amount: number;

  @Column()
  status: string;

  @Column({
    nullable: true,
    name: 'trial_end',
  })
  trialEnd: Date;

  @Column({
    name: 'current_period_end',
  })
  currentPeriodEnd: Date;
  @Column({
    name: 'current_period_start',
  })
  currentPeriodStart: Date;

  @Column({
    name: 'user_id',
  })
  userId: string;

  @Column({
    name: 'plan_id',
  })
  planId: string;

  @ManyToOne(() => User, (user) => user.subscriptions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Plan, (plan) => plan.subscriptions)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;
}
