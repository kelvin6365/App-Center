import { Logger, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AppRepository } from '../../database/repositories/app.repository';
import { AppVersionRepository } from '../../database/repositories/app.version.repository';
import { FileModule } from '../file/file.module';
import { AppVersionTagRepository } from '../../database/repositories/app.version.tag.repository';
import { JiraModule } from '../jira/jira.module';
import { CredentialModule } from '../credential/credential.module';

@Module({
  imports: [FileModule, JiraModule, CredentialModule],
  controllers: [AppController],
  providers: [
    Logger,
    AppService,
    AppRepository,
    AppVersionRepository,
    AppVersionTagRepository,
  ],
  exports: [AppService],
})
export class AppModule {}
