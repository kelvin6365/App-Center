import { ApiProperty } from '@nestjs/swagger';
import { PricingTiers } from '../entities/pricing.tier.entity';

export class PricingTierDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  billingCycle: string;
  @ApiProperty()
  discountPercentage: number | null;
  constructor(pricingTier: PricingTiers) {
    this.id = pricingTier.id;
    this.price = pricingTier.price;
    this.billingCycle = pricingTier.billingCycle;
    this.discountPercentage = pricingTier.discountPercentage;
  }
}
