import { ApiProperty } from '@nestjs/swagger';
import { Subscription } from '../entities/subscription.entity';
import { PlanDto } from './plan.dto';

export class SubscriptionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  trialEnd: Date;

  @ApiProperty()
  currentPeriodEnd: Date;

  @ApiProperty()
  currentPeriodStart: Date;

  // @ApiProperty()
  // stripeSubscriptionId: string;

  // @ApiProperty()
  // stripeCustomerId: string;

  // @ApiProperty()
  // stripePlanId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  planId: string;

  @ApiProperty()
  plan: PlanDto;

  constructor(partial: Partial<Subscription>) {
    this.id = partial.id;
    this.amount = partial.amount;
    this.status = partial.status;
    this.trialEnd = partial.trialEnd;
    this.currentPeriodEnd = partial.currentPeriodEnd;
    this.currentPeriodStart = partial.currentPeriodStart;
    // this.stripeSubscriptionId = partial.stripeSubscriptionId;
    // this.stripeCustomerId = partial.stripeCustomerId;
    // this.stripePlanId = partial.stripePlanId;
    this.userId = partial.userId;
    this.planId = partial.planId;
    this.plan = new PlanDto(partial.plan);
  }
}
