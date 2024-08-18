import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPagingResponseSchema } from '../../common/decorator/swagger.paging.decorator';
import { AppResponse } from '../../common/response/app.response';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlanDto } from '../plan/dto/plan.dto';
import { PlanService } from '../plan/plan.service';
import { PageDTO } from '../../common/dto/page.dto';

@ApiTags('Portal / Plan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: '/portal/plan', version: ['1'] })
export class PortalPlanController {
  constructor(private readonly planService: PlanService) {}

  //All plans
  @Get('')
  @ApiOperation({ summary: 'Get All Plans' })
  @ApiPagingResponseSchema(HttpStatus.OK, 'OK', PlanDto)
  async getAllPlans() {
    return new AppResponse<PageDTO<PlanDto>>(
      await this.planService.getAllPlans()
    );
  }
}
