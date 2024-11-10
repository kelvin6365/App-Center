import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('stripe_webhooks')
export class StripeWebhook extends BaseEntity {
  @Column()
  stripeEventId: string;

  @Column('jsonb')
  eventData: object;

  @Column()
  eventType: string;

  @Column({ default: false })
  isHandled: boolean;
}
