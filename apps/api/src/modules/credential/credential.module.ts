import { Logger, Module } from '@nestjs/common';
import { CredentialController } from './credential.controller';
import { CredentialService } from './credential.service';
import { CredentialRepository } from '../../database/repositories/credential.repository';
import { CredentialComponentRepository } from '../../database/repositories/credential.component.repository';

@Module({
  imports: [],
  controllers: [CredentialController],
  providers: [
    Logger,
    CredentialService,
    CredentialRepository,
    CredentialComponentRepository,
  ],
  exports: [CredentialService],
})
export class CredentialModule {}
