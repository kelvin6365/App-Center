import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Plan } from './plan.entity';
@Entity('subscriptions')
export class Subscription extends BaseEntity {
  @Column()
  stripeSubscriptionId: string;
  @Column()
  stripeCustomerId: string;
  @Column()
  stripePlanId: string;

  @Column()
  amount: number;

  @Column()
  status: string;

  @Column({
    nullable: true,
  })
  trialEnd: Date;

  @Column()
  currentPeriodEnd: Date;
  @Column()
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
