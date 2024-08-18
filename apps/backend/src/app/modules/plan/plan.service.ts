import { Injectable } from '@nestjs/common';
import { PlanRepository } from '../../database/repositories/plan.repository';
import { PageDTO } from '../../common/dto/page.dto';
import { MetaDTO } from '../../common/dto/meta.dto';
import { PlanDto } from './dto/plan.dto';

@Injectable()
export class PlanService {
  constructor(private readonly planRepository: PlanRepository) {}

  //get All Plan
  async getAllPlans(): Promise<PageDTO<PlanDto>> {
    const plans = await this.planRepository.getAllActivePlans();
    return new PageDTO(
      plans.map((plan) => new PlanDto(plan)),
      new MetaDTO()
    );
  }
}
