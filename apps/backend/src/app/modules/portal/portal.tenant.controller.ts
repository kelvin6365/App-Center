import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponseSchema } from '../../common/decorator/swagger.decorator';
import { AppResponse } from '../../common/response/app.response';
import { TenantService } from '../tenant/tenant.service';
import { CreateTenantDTO } from '../tenant/dto/create.tenant.dto';
import { CurrentUser } from '../../common/decorator/user.decorator';
import { CurrentUserDTO } from '../auth/dto/current.user.dto';
import { TenantDTO } from '../tenant/dto/tenant.dto';
import { UpdateTenantDTO } from '../tenant/dto/update.tenant.dto';
import { CurrentTenant } from '../../common/decorator/tenant.decorator';
import { Roles } from '../../common/decorator/roles.decorator';
import { RoleType } from '../role/enum/role.type.enum';
import RoleGuard from '../auth/role.guard';

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
  @Put('')
  @UseGuards(RoleGuard(RoleType.ADMIN))
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async update(
    @Body() updateTenantDTO: UpdateTenantDTO,
    @CurrentUser() user: CurrentUserDTO,
    @CurrentTenant() tenantId: string
  ) {
    return new AppResponse<boolean>(
      await this.tenantService.updateTenant(tenantId, updateTenantDTO, user)
    );
  }

  //Get a tenant by id

  //Delete a tenant by id
}
