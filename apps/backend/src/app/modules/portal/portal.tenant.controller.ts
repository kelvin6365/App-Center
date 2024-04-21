import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponseSchema } from '../../common/decorator/swagger.decorator';
import { AppResponse } from '../../common/response/app.response';
import { TenantService } from '../tenant/tenant.service';
import { CreateTenantDTO } from '../tenant/dto/create.tenant.dto';
import { CurrentUser } from '../../common/decorator/user.decorator';
import { CurrentUserDTO } from '../auth/dto/current.user.dto';
import { TenantDTO } from '../tenant/dto/tenant.dto';

@ApiTags('Portal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: '/portal/tenant', version: ['1'] })
export class PortalTenantController {
  constructor(private readonly tenantService: TenantService) {}
  //create a new tenant
  @Post('')
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async create(
    @Body() createTenantDTO: CreateTenantDTO,
    @CurrentUser() user: CurrentUserDTO
  ): Promise<AppResponse<TenantDTO>> {
    return new AppResponse<TenantDTO>(
      await this.tenantService.createTenantAndJoinTenant(createTenantDTO, user)
    );
  }

  //Update a tenant

  //Get a tenant by id

  //Delete a tenant by id
}
