import { ApiProperty } from '@nestjs/swagger';
import { PricingTierDto } from './pricing.tier.dto';
import { Plan } from '../entities/plan.entity';

export class PlanDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: {
    [key: string]: string;
  };
  @ApiProperty()
  description: {
    [key: string]: string;
  };
  @ApiProperty()
  maxTenants: number;
  @ApiProperty()
  appCreationLimit: number;
  @ApiProperty()
  storageLimit: number;
  @ApiProperty()
  pricingTiers: PricingTierDto[];
  constructor(plan: Plan) {
    this.id = plan.id;
    this.name = plan.name;
    this.description = plan.description;
    this.maxTenants = plan.maxTenants;
    this.appCreationLimit = plan.appCreationLimit;
    this.storageLimit = plan.storageLimit;
    this.pricingTiers = plan.pricingTiers?.map(
      (pricingTier) => new PricingTierDto(pricingTier),
    );
  }
}
