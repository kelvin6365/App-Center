import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponseSchema } from '../../common/decorator/swagger.decorator';
import { AppResponse } from '../../common/response/app.response';
import { SettingListDTO } from './dto/setting.list.dto';
import { SettingService } from './setting.service';
import { CreateSettingDTO } from './dto/create.setting.dto';
import { UpdateSettingDTO } from './dto/update.setting.dto';
import { SettingDTO } from './dto/setting.dto';
import { Public } from '../../common/decorator/public';
import { CurrentUserDTO } from '../auth/dto/current.user.dto';
import { CurrentUser } from '../../common/decorator/user.decorator';
import JwtPublicGuard from '../auth/jwt.public.guard';

@ApiTags('Setting')
@ApiBearerAuth()
@Controller({ path: 'setting', version: ['1'] })
export class SettingController {
  constructor(private readonly settingService: SettingService) {}
  @Public()
  @Get('')
  @UseGuards(JwtPublicGuard)
  @ApiBearerAuth()
  @ApiResponseSchema(HttpStatus.OK, 'OK', SettingListDTO)
  async findAll(
    @CurrentUser() user: CurrentUserDTO
  ): Promise<AppResponse<SettingListDTO>> {
    return new AppResponse<SettingListDTO>(
      await this.settingService.findAll(user)
    );
  }

  //create a new setting
  @Post('')
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async create(
    @Body() createSettingDTO: CreateSettingDTO
  ): Promise<AppResponse<boolean>> {
    return new AppResponse<boolean>(
      await this.settingService.createSetting(createSettingDTO)
    );
  }

  //update a setting
  @Put('')
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async update(
    @Body() updateSettingDTO: UpdateSettingDTO
  ): Promise<AppResponse<boolean>> {
    return new AppResponse<boolean>(
      await this.settingService.updateSetting(updateSettingDTO)
    );
  }

  //get a setting by key
  @Get('/:key')
  @ApiResponseSchema(HttpStatus.OK, 'OK', SettingDTO)
  async findByKey(@Param('key') key: string): Promise<AppResponse<SettingDTO>> {
    return new AppResponse<SettingDTO>(
      await this.settingService.getSettingByKey(key)
    );
  }
}
