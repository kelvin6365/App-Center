import { Logger, Module } from '@nestjs/common';
import { JiraService } from './jira.service';
import { JiraUtil } from './jira.util';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [Logger, JiraService, JiraUtil],
  exports: [JiraService, JiraUtil],
})
export class JiraModule {}
