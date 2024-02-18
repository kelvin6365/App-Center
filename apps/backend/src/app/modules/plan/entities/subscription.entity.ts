import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
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
  currency: string;
  @Column()
  status: string;

  @Column()
  trialEnd: Date;

  @Column()
  currentPeriodEnd: Date;
  @Column()
  currentPeriodStart: Date;

  @Column({
    name: 'userId',
  })
  userId: string;

  @Column({
    name: 'planId',
  })
  planId: string;
}
