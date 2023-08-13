import { Injectable, Response } from '@nestjs/common';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { Setting } from '../../modules/setting/entities/setting.entity';
import { AppException } from '../../common/response/app.exception';
import { ResponseCode } from '../../common/response/response.code';

@Injectable()
export class SettingRepository extends Repository<Setting> {
  constructor(dataSource: DataSource) {
    super(Setting, dataSource.createEntityManager());
  }

  //get all settings
  async findAll(withDeleted = false): Promise<Setting[]> {
    return this.find({
      withDeleted,
    });
  }

  //create setting
  async createSetting(setting: Setting): Promise<Setting> {
    try {
      return await this.save(setting);
    } catch (error) {
      console.log(error);
      switch (error.code) {
        case '23505':
          throw new AppException(
            ResponseCode.STATUS_1012_FAIL_TO_CREATE('Key already exist.')
          );
        default:
          throw error;
      }
    }
  }

  //update setting
  async updateSetting(setting: Setting): Promise<Setting> {
    try {
      return await this.save(setting);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //get setting by id
  async getSettingByKey(key: string, withDeleted = false): Promise<Setting> {
    return await this.findOne({ where: { key }, withDeleted });
  }

  //delete
  async deleteSetting(id: string): Promise<DeleteResult> {
    return await this.softDelete({ id });
  }
}
