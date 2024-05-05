import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Plan } from '../../modules/plan/entities/plan.entity';

@Injectable()
export class PlanRepository extends Repository<Plan> {
  constructor(dataSource: DataSource) {
    super(Plan, dataSource.createEntityManager());
  }

  getPlanById(
    planId: string,
    isActive = true,
    withDeleted = false
  ): Promise<Plan> {
    return this.findOne({
      where: { id: planId, isActive },
      withDeleted,
      relations: ['pricingTiers'],
    });
  }

  findOneByStripePlanId(stripePlanId: string, isActive = true): Promise<Plan> {
    return this.findOne({
      where: { productId: stripePlanId, isActive },
      relations: ['pricingTiers'],
    });
  }

  createPlan(plan: Plan): Promise<Plan> {
    return this.save(plan);
  }
}
