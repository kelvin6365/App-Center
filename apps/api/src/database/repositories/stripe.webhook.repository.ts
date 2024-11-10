import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { StripeWebhook } from '../../modules/stripe/entities/stripe.webhook.entity';

@Injectable()
export class StripeWebhookRepository extends Repository<StripeWebhook> {
  constructor(dataSource: DataSource) {
    super(StripeWebhook, dataSource.createEntityManager());
  }

  createStripeWebhook(stripeWebhook: StripeWebhook): Promise<StripeWebhook> {
    return this.save(stripeWebhook);
  }

  async updateStripeWebhook(
    stripeWebhook: StripeWebhook,
  ): Promise<StripeWebhook> {
    return this.save(stripeWebhook);
  }
}
