import { Injectable } from '@nestjs/common';
import { SettingRepository } from '../../database/repositories/setting.repository';
import { SettingDTO } from './dto/setting.dto';
import { SettingListDTO } from './dto/setting.list.dto';
import { Setting } from './entities/setting.entity';
import { CreateSettingDTO } from './dto/create.setting.dto';
import { AppException } from '../../common/response/app.exception';
import { ResponseCode } from '../../common/response/response.code';
import { UpdateSettingDTO } from './dto/update.setting.dto';
import { CurrentUserDTO } from '../auth/dto/current.user.dto';

@Injectable()
export class SettingService {
  constructor(private readonly settingRepository: SettingRepository) {}

  //get all settings
  async findAll(
    user: CurrentUserDTO,
    withDeleted = false
  ): Promise<SettingListDTO> {
    const settings = await this.settingRepository.findAll(
      user.id !== undefined,
      withDeleted
    );
    return new SettingListDTO(
      settings.map((setting) => new SettingDTO(setting))
    );
  }

  //create setting
  async createSetting(setting: CreateSettingDTO): Promise<boolean> {
    const newSetting = new Setting();
    newSetting.key = setting.key;
    newSetting.config = setting.config;
    newSetting.type = setting.type;
    const result = await this.settingRepository.createSetting(newSetting);
    return result ? true : false;
  }

  //update setting
  async updateSetting(setting: UpdateSettingDTO): Promise<boolean> {
    //get setting by id
    const result = await this.settingRepository.getSettingByKey(setting.key);
    if (!result || result.id !== setting.id) {
      throw new AppException(ResponseCode.STATUS_1011_NOT_FOUND);
    }
    result.config = setting.config;
    const updatedSetting = await this.settingRepository.updateSetting(result);
    return updatedSetting ? true : false;
  }

  //get setting by key
  async getSettingByKey(key: string): Promise<SettingDTO> {
    const result = await this.settingRepository.getSettingByKey(key);
    return new SettingDTO(result);
  }
}
