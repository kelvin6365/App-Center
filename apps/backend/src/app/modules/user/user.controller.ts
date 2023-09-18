import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AppResponse } from '../../common/response/app.response';
import { PortalUserResponseDTO } from './dto/portal.user.response.dto';
import { CreateUserDTO } from './dto/create.user.dto';
import { Roles } from '../../common/decorator/roles.decorator';
import { RoleType } from '../role/enum/role.type.enum';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('User')
@Controller({ path: '/user', version: ['1'] })
export class UserController {
  constructor(private readonly userService: UserService) {}

  //Get All Users
  @Get()
  async getAllUsers(): Promise<AppResponse> {
    return new AppResponse();
  }

  //Get Single User
  @Get(':id')
  async getSingleUser(
    @Param('id') id: string
  ): Promise<AppResponse<PortalUserResponseDTO>> {
    return new AppResponse<PortalUserResponseDTO>(
      await this.userService.getUserByIdWithDeletedFalse(id)
    );
  }

  //Create User
  @Post()
  @Roles(RoleType.ADMIN)
  async createUser(
    @Body() createUserDTO: CreateUserDTO
  ): Promise<AppResponse<boolean>> {
    return new AppResponse<boolean>(
      await this.userService.createUser(createUserDTO)
    );
  }
}
