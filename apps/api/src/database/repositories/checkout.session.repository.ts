import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CheckoutSession } from '../../modules/stripe/entities/checkout.session.entity';
import { CheckoutSessionStatus } from '../../modules/stripe/enum/checkout.session.status.enum';

@Injectable()
export class CheckoutSessionRepository extends Repository<CheckoutSession> {
  constructor(dataSource: DataSource) {
    super(CheckoutSession, dataSource.createEntityManager());
  }

  createCheckoutSession(
    checkoutSession: CheckoutSession,
  ): Promise<CheckoutSession> {
    return this.save(checkoutSession);
  }

  updateCheckoutSession(checkoutSession: CheckoutSession) {
    return this.save(checkoutSession);
  }

  findCheckoutSessionBySessionId(
    sessionId: string,
    status?: CheckoutSessionStatus,
  ) {
    return this.findOne({
      where: {
        sessionId: sessionId,
        status: status,
      },
    });
  }

  findCheckoutSessionByUserIdAndPlanId(
    userId: string,
    planId: string,
    billingCycle: string,
    status?: CheckoutSessionStatus,
  ) {
    return this.findOne({
      where: {
        userId: userId,
        planId: planId,
        status: status,
        billingCycle,
      },
    });
  }

  findCheckoutSessionByCustomerIdAndPlanId(
    customerId: string,
    planId: string,
    status?: CheckoutSessionStatus,
  ) {
    return this.findOne({
      where: {
        customerId: customerId,
        planId: planId,
        status: status,
      },
    });
  }
}
