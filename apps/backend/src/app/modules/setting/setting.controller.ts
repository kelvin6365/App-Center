import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseSchema } from '../../common/decorator/swagger.decorator';
import { AppResponse } from '../../common/response/app.response';
import { SettingListDTO } from './dto/setting.list.dto';
import { SettingService } from './setting.service';
import { CreateSettingDTO } from './dto/create.setting.dto';
import { UpdateSettingDTO } from './dto/update.setting.dto';
import { SettingDTO } from './dto/setting.dto';

@ApiTags('Setting')
@Controller({ path: 'setting', version: ['1'] })
export class SettingController {
  constructor(private readonly settingService: SettingService) {}
  @Get('')
  @ApiResponseSchema(HttpStatus.OK, 'OK', SettingListDTO)
  async findAll(): Promise<AppResponse> {
    return new AppResponse(await this.settingService.findAll());
  }

  //create a new setting
  @Post('')
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async create(
    @Body() createSettingDTO: CreateSettingDTO
  ): Promise<AppResponse> {
    return new AppResponse(
      await this.settingService.createSetting(createSettingDTO)
    );
  }

  //update a setting
  @Put('')
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async update(
    @Body() updateSettingDTO: UpdateSettingDTO
  ): Promise<AppResponse> {
    return new AppResponse(
      await this.settingService.updateSetting(updateSettingDTO)
    );
  }

  //get a setting by key
  @Get('/:key')
  @ApiResponseSchema(HttpStatus.OK, 'OK', SettingDTO)
  async findByKey(@Param('key') key: string): Promise<AppResponse> {
    return new AppResponse(await this.settingService.getSettingByKey(key));
  }
}
