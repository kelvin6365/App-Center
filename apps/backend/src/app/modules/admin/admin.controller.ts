import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Res,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create.admin.dto';
import { UpdateAdminDto } from './dto/update.admin.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseSchema } from '../../common/decorator/swagger.decorator';
import { Public } from '../../common/decorator/public';
import { Response } from 'express';
import { AppResponse } from '../../common/response/app.response';
import { AdminLoginRequestDTO } from '../auth/admin/dto/admin.login.request.dto';
import { CurrentUser } from '../../common/decorator/user.decorator';
import { CurrentAdminDTO } from '../auth/admin/dto/current.admin.dto';
import { LoginResponseDTO } from '../auth/admin/dto/login.response.dto';
import { JSONQuery } from '../../common/decorator/json.query';
import { SearchQueryDTO } from '../../common/dto/search.dto';
import { AdminResponseDTO } from './dto/admin.response.dto';
import { PageDTO } from '../../common/dto/page.dto';
import { ApiPagingResponseSchema } from '../../common/decorator/swagger.paging.decorator';
import { LocalAdminAuthGuard } from '../auth/admin/local-admin-auth.guard';
import { JwtAdminAuthGuard } from '../auth/admin/jwt-admin-auth.guard';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAdminAuthGuard)
@Controller({ path: 'admin', version: ['1'] })
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  //Admin Login
  @Public()
  @UseGuards(LocalAdminAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Admin Login' })
  @ApiBody({ type: AdminLoginRequestDTO })
  @ApiResponseSchema(HttpStatus.OK, 'OK', LoginResponseDTO)
  async login(
    @CurrentUser() user: CurrentAdminDTO,
    @Res({ passthrough: true }) response: Response
  ): Promise<AppResponse<LoginResponseDTO>> {
    response.clearCookie('Authentication');
    const result: LoginResponseDTO = await this.adminService.signTokenForLogin(
      user
    );
    response.cookie('Authentication', result.accessToken);
    return new AppResponse(result);
  }

  @Post()
  @ApiOperation({ summary: 'Create a Admin' })
  @ApiResponseSchema(HttpStatus.CREATED, 'CREATED')
  async create(
    @CurrentUser() user: CurrentAdminDTO,
    @Body() createAdminDto: CreateAdminDto
  ): Promise<AppResponse<boolean>> {
    return new AppResponse<boolean>(
      await this.adminService.create(createAdminDto, user)
    );
  }

  @Get()
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
  @ApiPagingResponseSchema(HttpStatus.OK, 'OK', AdminResponseDTO)
  async findAll(
    @JSONQuery('query') query: SearchQueryDTO,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @CurrentUser() user: CurrentAdminDTO
  ): Promise<AppResponse<PageDTO<AdminResponseDTO>>> {
    return new AppResponse<PageDTO<AdminResponseDTO>>(
      await this.adminService.findAll(
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

  @Get(':id')
  @ApiOperation({ summary: 'Get admin by UUID' })
  @ApiResponseSchema(HttpStatus.OK, 'OK', AdminResponseDTO)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<AppResponse<AdminResponseDTO>> {
    return new AppResponse<AdminResponseDTO>(
      await this.adminService.findOne(id)
    );
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update admin status by UUID' })
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @CurrentUser() user: CurrentAdminDTO
  ): Promise<AppResponse<boolean>> {
    return new AppResponse<boolean>(
      await this.adminService.updateStatus(id, updateAdminDto, user)
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft Delete admin status by UUID' })
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async softDelete(
    @Param('id') id: string,
    @CurrentUser() user: CurrentAdminDTO
  ): Promise<AppResponse<boolean>> {
    return new AppResponse<boolean>(
      await this.adminService.softDelete(id, user)
    );
  }
}
