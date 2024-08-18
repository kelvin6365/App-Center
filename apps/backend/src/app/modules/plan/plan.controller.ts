import { Controller } from '@nestjs/common';
import { PlanService } from './plan.service';
import { AppResponse } from '../../common/response/app.response';
import { PageDTO } from '../../common/dto/page.dto';
import { PlanDto } from './dto/plan.dto';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  //Get All Plan
  async getAllPlans() {
    return new AppResponse<PageDTO<PlanDto>>(
      await this.planService.getAllPlans()
    );
  }
}
