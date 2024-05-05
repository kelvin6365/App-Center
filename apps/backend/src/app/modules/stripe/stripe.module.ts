import { Logger, Module } from '@nestjs/common';
import { StripeWebhookRepository } from '../../database/repositories/stripe.webhook.repository';
import { UserRepository } from '../../database/repositories/users.repository';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { PlanRepository } from '../../database/repositories/plan.repository';
import { CheckoutSessionRepository } from '../../database/repositories/checkout.session.repository';
import { SubscriptionRepository } from '../../database/repositories/subscription.repository';
import { StripeUtil } from './stripe.util';

@Module({
  imports: [],
  controllers: [StripeController],
  providers: [
    Logger,
    StripeService,
    StripeWebhookRepository,
    UserRepository,
    PlanRepository,
    CheckoutSessionRepository,
    SubscriptionRepository,
    StripeUtil,
  ],
  exports: [StripeService],
})
export class StripeModule {}
