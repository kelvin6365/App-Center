import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('checkout_sessions')
export class CheckoutSession extends BaseEntity {
  @Column({
    name: 'session_id',
  })
  sessionId: string;

  @Column({
    name: 'user_id',
  })
  userId: string;

  @Column()
  status: string;

  @Column({
    name: 'plan_id',
  })
  planId: string;

  @Column({ nullable: true, name: 'customer_id' })
  customerId: string;

  @Column('jsonb')
  response: object;

  @Column({
    name: 'billing_cycle',
  })
  billingCycle: string;
}
