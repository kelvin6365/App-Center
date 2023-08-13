import { Logger, Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { SettingRepository } from '../../database/repositories/setting.repository';

@Module({
  controllers: [SettingController],
  providers: [Logger, SettingService, SettingRepository],
  exports: [SettingService],
})
export class SettingModule {}
