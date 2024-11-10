import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Subscription } from '../../modules/plan/entities/subscription.entity';

@Injectable()
export class SubscriptionRepository extends Repository<Subscription> {
  constructor(dataSource: DataSource) {
    super(Subscription, dataSource.createEntityManager());
  }

  createSubscription(subscription: Subscription): Promise<Subscription> {
    return this.save(subscription);
  }
  updateSubscription(subscription: Subscription): Promise<Subscription> {
    return this.save(subscription);
  }

  findOneByStripeSubscriptionId(
    stripeSubscriptionId: string
  ): Promise<Subscription> {
    return this.findOne({
      where: {
        stripeSubscriptionId: stripeSubscriptionId,
      },
    });
  }

  findUserSubscriptionByUserIdAndPlanId(
    userId: string,
    planId: string,
    status = 'active'
  ): Promise<Subscription> {
    return this.findOne({
      where: {
        userId: userId,
        planId: planId,
        status: status,
      },
      relations: ['user', 'plan'],
    });
  }

  findUserSubscriptionByUserId(
    userId: string,
    status = 'active'
  ): Promise<Subscription> {
    return this.findOne({
      where: {
        userId: userId,
        status,
      },
      relations: ['plan'],
    });
  }

  findUserSubscriptionsByUserId(
    userId: string,
    status = 'active'
  ): Promise<Subscription[]> {
    return this.find({
      where: {
        userId: userId,
        status,
      },
      relations: ['plan'],
    });
  }
}
