import {
  Body,
  Controller,
  DefaultValuePipe,
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
import { Roles } from '../../common/decorator/roles.decorator';
import { ApiResponseSchema } from '../../common/decorator/swagger.decorator';
import { ApiPagingResponseSchema } from '../../common/decorator/swagger.paging.decorator';
import { CurrentUser } from '../../common/decorator/user.decorator';
import { MetaDTO } from '../../common/dto/meta.dto';
import { PageDTO } from '../../common/dto/page.dto';
import { SearchQueryDTO } from '../../common/dto/search.dto';
import { AppResponse } from '../../common/response/app.response';
import { CurrentUserDTO } from '../auth/dto/current.user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleType } from '../role/enum/role.type.enum';
import { TenantDTO } from '../tenant/dto/tenant.dto';
import { CreateUserDTO } from '../user/dto/create.user.dto';
import { PortalUserResponseDTO } from '../user/dto/portal.user.response.dto';
import { UpdateUserDTO } from '../user/dto/update.user.dto';
import { UpdateUserStatusRequestDTO } from '../user/dto/update.user.status.request.dto';
import { UserService } from '../user/user.service';
import { AddUserRequestDTO } from '../user/dto/add.user.request.dto';
import { AppService } from '../app/app.service';

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
  @Roles(RoleType.ADMIN)
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
    @Param('tenantId') tenantId: string,
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
  @Roles(RoleType.ADMIN)
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
  @Roles(RoleType.ADMIN)
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

  //Update User status
  @Put(':id/status')
  @Roles(RoleType.ADMIN)
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
  @Roles(RoleType.ADMIN)
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
  @Roles(RoleType.ADMIN)
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async findUserByEmailWithPassword(@Param('id') id: string) {
    return new AppResponse<PortalUserResponseDTO[]>(
      await this.userService.findUseAppPermissionsListByAppId(id)
    );
  }
}
