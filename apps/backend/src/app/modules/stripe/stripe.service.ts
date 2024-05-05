import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  RawBodyRequest,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Request } from 'express';
import { StripeWebhookRepository } from '../../database/repositories/stripe.webhook.repository';
import { StripeWebhook } from './entities/stripe.webhook.entity';
import { CreateCheckoutSessionDTO } from './dto/create.checkout.session.dto';
import { CurrentUserDTO } from '../auth/dto/current.user.dto';
import { UserRepository } from '../../database/repositories/users.repository';
import { PlanRepository } from '../../database/repositories/plan.repository';
import { AppException } from '../../common/response/app.exception';
import { ResponseCode } from '../../common/response/response.code';
import { CheckoutSessionRepository } from '../../database/repositories/checkout.session.repository';
import { CheckoutSession } from './entities/checkout.session.entity';
import { CheckoutSessionStatus } from './enum/checkout.session.status.enum';
import { Subscription } from '../plan/entities/subscription.entity';
import { SubscriptionRepository } from '../../database/repositories/subscription.repository';
import { StripeUtil } from './stripe.util';
import { Plan } from '../plan/entities/plan.entity';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private endpointSecret: string;

  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly stripeWebhookRepository: StripeWebhookRepository,
    private readonly planRepository: PlanRepository,
    private readonly checkoutSessionRepository: CheckoutSessionRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly stripeUtil: StripeUtil
  ) {
    this.logger = new Logger(StripeService.name);
    this.stripe = new Stripe(
      this.configService.get<string>('services.stripe.secretKey'),
      {
        apiVersion: '2024-04-10', // Use whatever API latest version
      }
    );
    this.endpointSecret = this.configService.get<string>(
      'services.stripe.endpointSecret'
    );
  }

  //Create checkout session
  async createCheckoutSession(
    dto: CreateCheckoutSessionDTO,
    user: CurrentUserDTO
  ) {
    let customerId = user.stripeCustomerId;
    let session: Stripe.Response<Stripe.Checkout.Session>;
    //get plan
    const plan = await this.planRepository.getPlanById(dto.planId);
    if (!plan) {
      throw new AppException(ResponseCode.STATUS_1011_NOT_FOUND);
    }

    // Calculate the discounted price if it's a yearly billing cycle
    const pricingTier = plan.pricingTiers.find(
      (t) => t.billingCycle == dto.billingCycle
    );
    if (!pricingTier) {
      throw new AppException(ResponseCode.STATUS_1011_NOT_FOUND);
    }

    //check if user has open subscription
    const checkoutSession =
      await this.checkoutSessionRepository.findCheckoutSessionByUserIdAndPlanId(
        user.id,
        dto.planId,
        dto.billingCycle,
        CheckoutSessionStatus.Open
      );

    //check user already has subscription
    const subscription = await this.subscriptionRepository.findUserSubscription(
      user.id,
      dto.planId,
      'active'
    );
    if (subscription) {
      throw new AppException(ResponseCode.STATUS_9000_ALREADY_SUBSCRIBED);
    }

    if (!checkoutSession) {
      this.logger.debug('===create checkout session===');
      //create customer if not exist
      if (!customerId) {
        const customer = await this.stripe.customers.create({
          email: user.username,
          name: user.name,
          metadata: {
            userId: user.id,
            username: user.username,
            initPlanId: dto.planId,
          },
        });
        customerId = customer.id;
        //update user with stripe customer id
        await this.userRepository.updateUserStripeCustomerId(
          user.id,
          customer.id
        );
      }
      //create checkout session
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
          quantity: 1,
          price: pricingTier.stripePlanId,
        },
      ];
      session = await this.stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        line_items: lineItems,
        metadata: {
          userId: user.id, // Pass your user ID as metadata
          username: user.username,
          planId: dto.planId,
          billingCycle: dto.billingCycle,
        },
        subscription_data: {
          metadata: {
            userId: user.id, // Pass your user ID as metadata
            username: user.username,
            planId: dto.planId,
            billingCycle: dto.billingCycle,
          },
        },
        customer: customerId,
        success_url: `${this.configService.get<string>(
          'app.portalURL'
        )}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.configService.get<string>(
          'app.portalURL'
        )}/?canceled=true`,
      });
      //create checkout session
      const newCheckoutSession = new CheckoutSession();
      newCheckoutSession.sessionId = session.id;
      newCheckoutSession.userId = user.id;
      newCheckoutSession.planId = dto.planId;
      newCheckoutSession.customerId = customerId;
      newCheckoutSession.status = session.status;
      newCheckoutSession.response = session;
      newCheckoutSession.billingCycle = dto.billingCycle;
      await this.checkoutSessionRepository.createCheckoutSession(
        newCheckoutSession
      );
    } else {
      this.logger.debug('===update checkout session===');
      //update checkout session
      session = await this.stripe.checkout.sessions.retrieve(
        checkoutSession.sessionId
      );
      checkoutSession.status = session.status;
      checkoutSession.response = session;
      await this.checkoutSessionRepository.updateCheckoutSession(
        checkoutSession
      );
    }

    return session;
  }

  //handle webhook
  async handleWebhook(request: RawBodyRequest<Request>, sig: string) {
    let event: Stripe.Event = request.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (this.endpointSecret) {
      // Get the signature sent by Stripe
      try {
        event = this.stripeUtil.verifyWebhookSignature(
          request.rawBody,
          sig,
          this.endpointSecret,
          this.stripe
        );
        this.logger.log(`🔔  Webhook received. (With endpointSecret)`);
      } catch (err) {
        this.logger.error(
          `⚠️  Webhook signature verification failed.`,
          err.message
        );
        throw new Error('Webhook signature verification failed.');
      }
    } else {
      this.logger.log(`🔔  Webhook received. (Without endpointSecret)`);
    }

    const webhook = new StripeWebhook();
    webhook.stripeEventId = event.id;
    webhook.eventType = event.type;
    webhook.eventData = event;

    await this.stripeWebhookRepository.createStripeWebhook(webhook);

    let subscription: Stripe.Subscription;
    let checkoutSession: Stripe.Checkout.Session;
    //switch case on event type
    switch (event.type) {
      case 'customer.subscription.trial_will_end':
        subscription = event.data.object;
        this.logger.log(`Subscription status is ${subscription.status}.`);
        // Then define and call a method to handle the subscription trial ending.
        // handleSubscriptionTrialEnding(subscription);
        break;
      case 'customer.subscription.deleted':
        subscription = event.data.object;
        this.logger.log(`Subscription status is ${subscription.status}.`);
        // Then define and call a method to handle the subscription deleted.
        // handleSubscriptionDeleted(subscriptionDeleted);
        break;
      case 'customer.subscription.created':
        subscription = event.data.object;
        this.logger.log(`Subscription status is ${subscription.status}.`);
        // Then define and call a method to handle the subscription created.
        await this.handleSubscriptionCreated(subscription);
        webhook.isHandled = true;
        await this.stripeWebhookRepository.updateStripeWebhook(webhook);
        break;
      case 'customer.subscription.updated':
        subscription = event.data.object;
        this.logger.log(`Subscription status is ${subscription.status}.`);
        // Then define and call a method to handle the subscription update.
        await this.handleSubscriptionUpdated(subscription);
        webhook.isHandled = true;
        await this.stripeWebhookRepository.updateStripeWebhook(webhook);
        break;
      case 'checkout.session.completed':
        checkoutSession = event.data.object;
        this.logger.log(
          `Checkout Session status is ${checkoutSession.status}.`
        );
        await this.handleCheckoutSessionCompleted(checkoutSession);
        webhook.isHandled = true;
        await this.stripeWebhookRepository.updateStripeWebhook(webhook);
        break;
      case 'product.updated':
        this.logger.log(
          `Product created is ${event.data.object.created}. livemode is ${event.data.object.livemode}.`
        );
        // Then define and call a method to handle the product update.
        // handleProductUpdated(productUpdated);
        break;
      case 'product.deleted':
        this.logger.log(
          `Product deleted is ${event.data.object.deleted}. livemode is ${event.data.object.livemode}.`
        );
        // Then define and call a method to handle the product deleted.
        // handleProductDeleted(productDeleted);
        break;
      case 'product.created':
        this.logger.log(
          `Product created is ${event.data.object.created}. livemode is ${event.data.object.livemode}.`
        );
        // Then define and call a method to handle the product created.
        await this.handleProductCreated(event.data.object);
        break;
      default:
        // Unexpected event type
        this.logger.log(`Unhandled event type ${event.type}.`);
    }
  }

  async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    this.logger.debug(
      `===handle subscription created===  id: ${subscription.id}`
    );
    this.logger.debug(subscription);

    //Find user by customer id
    const user = await this.userRepository.findUserByStripeCustomerId(
      subscription.customer.toString()
    );
    if (!user) {
      //No user found, return
      this.logger.debug('===No user found===');
      return;
    }

    //check user already has subscription
    const userSubscription =
      await this.subscriptionRepository.findUserSubscription(
        user.id,
        subscription.metadata.planId,
        'active'
      );
    if (userSubscription) {
      throw new AppException(ResponseCode.STATUS_9000_ALREADY_SUBSCRIBED);
    }

    // Create a new Subscription entity
    const newSubscription = new Subscription();
    newSubscription.stripeSubscriptionId = subscription.id;
    newSubscription.stripeCustomerId = subscription.customer.toString();
    newSubscription.stripePlanId = subscription['plan'].id;
    newSubscription.amount = subscription['plan'].amount;
    newSubscription.status = subscription.status;
    newSubscription.trialEnd = subscription.trial_end
      ? new Date(subscription.trial_end * 1000)
      : null;
    newSubscription.currentPeriodEnd = new Date(
      subscription.current_period_end * 1000
    );
    newSubscription.currentPeriodStart = new Date(
      subscription.current_period_start * 1000
    );
    newSubscription.userId = user.id;
    newSubscription.stripeCustomerId = subscription.customer.toString();
    newSubscription.status = subscription.status;
    newSubscription.planId = subscription.metadata.planId;

    // Save the new Subscription entity
    await this.subscriptionRepository.save(newSubscription);
  }
  async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    this.logger.debug(
      `===handle subscription updated===  id: ${subscription.id}`
    );
    this.logger.debug(subscription);

    // Find the associated Subscription entity
    const existingSubscription =
      await this.subscriptionRepository.findOneByStripeSubscriptionId(
        subscription.id
      );

    if (existingSubscription) {
      // Update the Subscription entity with the latest data
      existingSubscription.status = subscription.status;
      existingSubscription.trialEnd = subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null;
      existingSubscription.currentPeriodEnd = new Date(
        subscription.current_period_end * 1000
      );
      existingSubscription.currentPeriodStart = new Date(
        subscription.current_period_start * 1000
      );
      // Save the updated Subscription entity
      await this.subscriptionRepository.updateSubscription(
        existingSubscription
      );
    }
  }

  async handleCheckoutSessionCompleted(
    checkoutSession: Stripe.Checkout.Session
  ) {
    this.logger.debug(
      `===handle checkout session completed===  id: ${checkoutSession.id}`
    );
    this.logger.debug(checkoutSession);
    //update checkout session
    const _checkoutSession =
      await this.checkoutSessionRepository.findCheckoutSessionBySessionId(
        checkoutSession.id
      );
    if (_checkoutSession) {
      _checkoutSession.status = checkoutSession.status;
      _checkoutSession.response = checkoutSession;
      await this.checkoutSessionRepository.updateCheckoutSession(
        _checkoutSession
      );
    } else {
      this.logger.debug('===checkout session not found===');
      this.logger.debug(checkoutSession);
    }
  }

  async handleProductCreated(product: Stripe.Product) {
    this.logger.debug(`===handle product created===  id: ${product.id}`);
    this.logger.debug(product);

    //check plan
    const plan = await this.planRepository.findOneByStripePlanId(product.id);
    if (plan) {
      this.logger.debug('===plan found===');
      this.logger.debug(plan);
      return;
    }
    if (!product.metadata.autoCreate) {
      this.logger.debug('===plan will not auto create===');
      this.logger.debug(product);
      return;
    }

    const newPlan = new Plan();
    newPlan.productId = product.id;
    newPlan.name = {
      en: product.name,
      'zh-HK': product.name,
    };
    newPlan.description = {
      en: product.description,
      'zh-HK': product.description,
    };
    newPlan.maxTenants = Number(product.metadata.maxTenants);
    newPlan.appCreationLimit = Number(product.metadata.appCreationLimit);
    newPlan.storageLimit = Number(product.metadata.storageLimit);
    newPlan.isActive = false;

    await this.planRepository.createPlan(newPlan);
  }
}
