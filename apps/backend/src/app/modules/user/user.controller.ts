import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorator/roles.decorator';
import { ApiResponseSchema } from '../../common/decorator/swagger.decorator';
import { CurrentUser } from '../../common/decorator/user.decorator';
import { AppResponse } from '../../common/response/app.response';
import { CurrentUserDTO } from '../auth/dto/current.user.dto';
import { RoleType } from '../role/enum/role.type.enum';
import { CreateUserDTO } from './dto/create.user.dto';
import { PortalUserResponseDTO } from './dto/portal.user.response.dto';
import { UpdateUserDTO } from './dto/update.user.dto';
import { UpdateUserStatusRequestDTO } from './dto/update.user.status.request.dto';
import { UserService } from './user.service';
@ApiTags('User')
@Controller({ path: '/user', version: ['1'] })
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // //Get All Users
  // @Get('search')
  // @Public()
  // @ApiOperation({ summary: 'Get all Admins with filter / sort / paging' })
  // @ApiQuery({
  //   name: 'query',
  //   required: false,
  //   description: `
  //   query = Supper Search for name / email fields
  //   {
  //     "query": "s",
  //     "filters": [
  //       { "key": "id", "values": ["aaedaf21-5ef5-42a9-a882-c2c336c56b99"] }
  //     ],
  //     "sorts": [
  //       { "key": "id", "value": "ASC" }
  //     ],
  //     "withDeleted": true
  //   }`,
  // })
  // @ApiQuery({ name: 'page', required: false })
  // @ApiQuery({ name: 'limit', required: false })
  // @ApiPagingResponseSchema(HttpStatus.OK, 'OK', PortalUserResponseDTO)
  // async getAllUsers(
  //   @JSONQuery('query') query: SearchQueryDTO,
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  //   @CurrentUser() user: CurrentUserDTO
  // ): Promise<AppResponse<PageDTO<PortalUserResponseDTO>>> {
  //   return new AppResponse<PageDTO<PortalUserResponseDTO>>(
  //     await this.userService.searchUser(
  //       query?.query ?? '',
  //       query?.withDeleted != null ? query.withDeleted : false,
  //       page,
  //       limit,
  //       query?.filters ?? [],
  //       query?.sorts ?? [{ key: 'createdAt', value: 'DESC' }],
  //       user
  //     )
  //   );
  // }

  //Get Single User
  @Get(':id')
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
      await this.userService.createUser(createUserDTO)
    );
  }

  //update user
  @Put('')
  @Roles(RoleType.ADMIN)
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
}
