import { OnBoardingDTO } from '@/modules/user/dto/onboarding.dto';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JSONQuery } from '../../common/decorator/json.query';
import { ApiResponseSchema } from '../../common/decorator/swagger.decorator';
import { ApiPagingResponseSchema } from '../../common/decorator/swagger.paging.decorator';
import { CurrentTenant } from '../../common/decorator/tenant.decorator';
import { CurrentUser } from '../../common/decorator/user.decorator';
import { MetaDTO } from '../../common/dto/meta.dto';
import { PageDTO } from '../../common/dto/page.dto';
import { SearchQueryDTO } from '../../common/dto/search.dto';
import { AppResponse } from '../../common/response/app.response';
import { AppService } from '../app/app.service';
import { CurrentUserDTO } from '../auth/dto/current.user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import RoleGuard from '../auth/role.guard';
import { RoleType } from '../role/enum/role.type.enum';
import { TenantDTO } from '../tenant/dto/tenant.dto';
import { AddUserRequestDTO } from '../user/dto/add.user.request.dto';
import { CreateUserDTO } from '../user/dto/create.user.dto';
import { InviteUserToTenantDTO } from '../user/dto/invite.user.to.tenant.dto';
import { PortalUserResponseDTO } from '../user/dto/portal.user.response.dto';
import { UpdateUserDTO } from '../user/dto/update.user.dto';
import { UpdateUserStatusRequestDTO } from '../user/dto/update.user.status.request.dto';
import { UserService } from '../user/user.service';

@ApiTags('Portal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: '/portal/user', version: ['1'] })
export class PortalUserController {
  constructor(
    private readonly userService: UserService,
    private readonly appService: AppService
  ) {}

  //Get user tenants
  @Get('/tenants')
  @ApiPagingResponseSchema(HttpStatus.OK, 'OK', TenantDTO)
  async getUserTenants(
    @CurrentUser() user: CurrentUserDTO
  ): Promise<AppResponse<PageDTO<TenantDTO>>> {
    return new AppResponse<PageDTO<TenantDTO>>(
      new PageDTO<TenantDTO>(
        user.tenants.map((userTenant) => new TenantDTO(userTenant.tenant)),
        new MetaDTO()
      )
    );
  }

  //Get All Users
  @Get('/tenant/:tenantId/search')
  @UseGuards(RoleGuard(RoleType.ADMIN))
  @ApiOperation({ summary: 'Get all Admins with filter / sort / paging' })
  @ApiQuery({
    name: 'query',
    required: false,
    description: `
    query = Supper Search for name / email fields
    {
      "query": "s",
      "filters": [
        { "key": "id", "values": ["aaedaf21-5ef5-42a9-a882-c2c336c56b99"] }
      ],
      "sorts": [
        { "key": "id", "value": "ASC" }
      ],
      "withDeleted": true
    }`,
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiPagingResponseSchema(HttpStatus.OK, 'OK', PortalUserResponseDTO)
  async getAllUsers(
    @JSONQuery('query') query: SearchQueryDTO,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: CurrentUserDTO
  ): Promise<AppResponse<PageDTO<PortalUserResponseDTO>>> {
    return new AppResponse<PageDTO<PortalUserResponseDTO>>(
      await this.userService.searchUser(
        tenantId,
        query?.query ?? '',
        query?.withDeleted != null ? query.withDeleted : false,
        page,
        limit,
        query?.filters ?? [],
        query?.sorts ?? [{ key: 'createdAt', value: 'DESC' }],
        user
      )
    );
  }

  //Get Single User
  @Get(':id')
  @UseGuards(RoleGuard(RoleType.ADMIN))
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async getSingleUser(
    @Param('id') id: string
  ): Promise<AppResponse<PortalUserResponseDTO>> {
    return new AppResponse<PortalUserResponseDTO>(
      await this.userService.getUserByIdWithDeletedFalse(id)
    );
  }

  //Get current User
  @Get('')
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async getCurrentUser(
    @CurrentUser() user: CurrentUserDTO
  ): Promise<AppResponse<PortalUserResponseDTO>> {
    return new AppResponse<PortalUserResponseDTO>(
      await this.userService.getUserByIdWithDeletedFalse(user.id)
    );
  }

  //Create User
  @Post()
  @UseGuards(RoleGuard(RoleType.ADMIN))
  @ApiResponseSchema(HttpStatus.CREATED, 'CREATED')
  async createUser(
    @Body() createUserDTO: CreateUserDTO
  ): Promise<AppResponse<boolean>> {
    return new AppResponse<boolean>(
      await await this.userService.createUser(createUserDTO)
    );
  }

  //update user
  @Put('')
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async updateCurrentUser(
    @Body() updateUserDTO: UpdateUserDTO,
    @CurrentUser() user: CurrentUserDTO
  ): Promise<AppResponse<PortalUserResponseDTO>> {
    return new AppResponse<PortalUserResponseDTO>(
      await this.userService.updateUserProfile(updateUserDTO, user)
    );
  }

  //Update User by id
  @Put(':id')
  @UseGuards(RoleGuard(RoleType.ADMIN))
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async updateUserById(
    @Param('id') id: string,
    @Body() updateUserDTO: UpdateUserDTO,
    @CurrentTenant() tenantId: string
  ): Promise<AppResponse<PortalUserResponseDTO>> {
    return new AppResponse<PortalUserResponseDTO>(
      await this.userService.updateUserProfileById(updateUserDTO, id, tenantId)
    );
  }

  //Delete user from team by id
  @Delete(':id')
  @UseGuards(RoleGuard(RoleType.ADMIN))
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async deleteUserById(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: CurrentUserDTO
  ): Promise<AppResponse<boolean>> {
    return new AppResponse<boolean>(
      await this.userService.deleteUserFromTenant(id, tenantId, user)
    );
  }

  //Update User status
  @Put(':id/status')
  @UseGuards(RoleGuard(RoleType.ADMIN))
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async updateUserStatus(
    @Param('id') id: string,
    @Body() updateUserStatusRequestDTO: UpdateUserStatusRequestDTO
  ): Promise<AppResponse<boolean>> {
    return new AppResponse<boolean>(
      await this.userService.updateUserStatus(
        id,
        updateUserStatusRequestDTO.status
      )
    );
  }

  //Add user to View app
  @Post('/:id/permission')
  @UseGuards(RoleGuard(RoleType.ADMIN))
  @ApiParam({ name: 'id', required: true })
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async addUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AddUserRequestDTO,
    @CurrentUser() user: CurrentUserDTO
  ) {
    await this.appService.findById(dto.appId, false, true, false, user);
    return new AppResponse(
      await this.userService.addPermissions(id, dto, user)
    );
  }

  //Find users with permissions for the specified app
  @Get('app/:appId/permissions')
  @UseGuards(RoleGuard(RoleType.ADMIN))
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async findUserByEmailWithPassword(@Param('id') id: string) {
    return new AppResponse<PortalUserResponseDTO[]>(
      await this.userService.findUseAppPermissionsListByAppId(id)
    );
  }

  //onboarding
  @Post('/onboarding')
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async onBoarding(
    @Body() dto: OnBoardingDTO,
    @CurrentUser() user: CurrentUserDTO
  ) {
    return new AppResponse<boolean>(
      await this.userService.onBoarding(dto, user)
    );
  }

  //invite user to tenant
  @Post('/invite')
  @UseGuards(RoleGuard(RoleType.ADMIN))
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async inviteUser(
    @Body() dto: InviteUserToTenantDTO,
    @CurrentUser() user: CurrentUserDTO,
    @CurrentTenant() tenantId: string
  ) {
    return new AppResponse<boolean>(
      await this.userService.inviteUserToTenant(dto, user, tenantId)
    );
  }
}
