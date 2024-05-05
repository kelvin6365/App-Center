import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { BillingCycle } from '../../plan/enum/pricing.tier.enum';

export class CreateCheckoutSessionDTO {
  @ApiProperty()
  @IsUUID()
  planId: string;

  @ApiProperty({
    enum: BillingCycle,
  })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;
}
