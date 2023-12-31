import { Inject, Injectable, Logger } from '@nestjs/common';
import { CredentialRepository } from '../../database/repositories/credential.repository';
import { CreateCredentialRequestDTO } from './dto/create.credential.request.dto';
import { CredentialResponseDTO } from './dto/credential.response.dto';
import { Credential } from './entities/credential.entity';
import { CurrentUserDTO } from '../auth/dto/current.user.dto';
import { UpdateCredentialRequestDTO } from './dto/update.credential.request.dto';
import { AppException } from '../../common/response/app.exception';
import { ResponseCode } from '../../common/response/response.code';
import { CredentialComponentRepository } from '../../database/repositories/credential.component.repository';
import { CredentialComponentResponseDTO } from './dto/credential.component.response.dto';
import {
  decryptCredentialData,
  encryptCredentialData,
} from '../../common/util/util';
import { omit } from 'lodash';

@Injectable()
export class CredentialService {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    private credentialRepository: CredentialRepository,
    private credentialComponentRepository: CredentialComponentRepository
  ) {
    this.logger = new Logger(CredentialService.name);
  }

  //Get all Credentials
  async getAllCredentials(
    tenantId: string,
    name: string,
    user: CurrentUserDTO
  ): Promise<CredentialResponseDTO[]> {
    const isAllowed = user.tenants.map((ut) => ut.tenant.id).includes(tenantId);
    if (!isAllowed) {
      throw new AppException(ResponseCode.STATUS_8003_PERMISSION_DENIED);
    }
    const credentials =
      await this.credentialRepository.getAllCredentialWithoutEncryptedData(
        {},
        [tenantId],
        name
      );
    return credentials.map(
      (credential) =>
        new CredentialResponseDTO(omit(credential, ['encryptedData']))
    );
  }

  //Get credential
  async getCredential(
    credentialId: string,
    user: CurrentUserDTO,
    showCredentials = false
  ): Promise<CredentialResponseDTO> {
    const credential = await this.credentialRepository.getCredential(
      credentialId,
      {},
      user.tenants.map((ut) => ut.tenant.id)
    );
    if (!credential) {
      throw new AppException(ResponseCode.STATUS_1011_NOT_FOUND);
    }
    //get credential component
    const credentialComponent =
      await this.credentialComponentRepository.getCredentialComponentByCredentialName(
        credential.credentialName
      );
    if (showCredentials) {
      credential.encryptedData = await decryptCredentialData(
        credential.encryptedData
      );
    } else {
      credential.encryptedData = await decryptCredentialData(
        credential.encryptedData,
        credential.credentialName,
        { [credential.credentialName]: credentialComponent }
      );
    }

    return new CredentialResponseDTO(credential);
  }

  //Create credential
  async createCredential(
    credential: CreateCredentialRequestDTO,
    user: CurrentUserDTO
  ): Promise<boolean> {
    //check if credential belongs to users tenants
    const userTenantIds = user.tenants.map((ut) => ut.tenant.id);
    if (!userTenantIds.includes(credential.tenantId)) {
      throw new AppException(ResponseCode.STATUS_8003_PERMISSION_DENIED);
    }
    const newCredential = new Credential();
    newCredential.name = credential.name;
    newCredential.credentialName = credential.credentialName;
    newCredential.encryptedData = credential.encryptedData;
    newCredential.createdBy = user.id;
    newCredential.tenantId = credential.tenantId;
    //Encrypt
    newCredential.encryptedData = await encryptCredentialData(
      credential.encryptedData
    );
    await this.credentialRepository.createCredential(newCredential);
    return true;
  }

  //Update credential
  async updateCredential(
    credentialId: string,
    credential: UpdateCredentialRequestDTO,
    user?: CurrentUserDTO
  ) {
    //Find credential
    const credentialToUpdate = await this.credentialRepository.getCredential(
      credentialId
    );
    if (!credentialToUpdate) {
      throw new AppException(ResponseCode.STATUS_1011_NOT_FOUND);
    }
    //check if credential belongs to users tenants
    const userTenantIds = user.tenants.map((ut) => ut.tenant.id);
    if (!userTenantIds.includes(credential.tenantId)) {
      throw new AppException(ResponseCode.STATUS_8003_PERMISSION_DENIED);
    }

    //Update credential
    credentialToUpdate.name = credential.name;
    credentialToUpdate.credentialName = credential.credentialName;
    if (user.id) {
      credentialToUpdate.updatedBy = user.id;
    }
    //Encrypt
    credentialToUpdate.encryptedData = await encryptCredentialData(
      credential.encryptedData
    );
    await this.credentialRepository.updateCredential(credentialToUpdate);
    return true;
  }

  //Delete credential
  async deleteCredential(credentialId: string, user?: CurrentUserDTO) {
    try {
      const credential = await this.credentialRepository.getCredential(
        credentialId
      );
      if (!credential) {
        throw new AppException(ResponseCode.STATUS_1011_NOT_FOUND);
      }
      //check if credential belongs to users tenants
      const userTenantIds = user.tenants.map((ut) => ut.tenant.id);
      if (!userTenantIds.includes(credential.tenantId)) {
        throw new AppException(ResponseCode.STATUS_8003_PERMISSION_DENIED);
      }
      await this.credentialRepository.deleteCredential(credentialId, user.id);
      return true;
    } catch (error) {
      console.log(error);
      this.logger.error(error.message);
      throw new AppException(ResponseCode.STATUS_1015_FAIL_TO_DELETE);
    }
  }

  //Get all credential components
  async getAllCredentialComponents(): Promise<
    CredentialComponentResponseDTO[]
  > {
    const credentialComponents =
      await this.credentialComponentRepository.getAllCredentialComponents();
    return credentialComponents.map(
      (credentialComponent) =>
        new CredentialComponentResponseDTO(credentialComponent)
    );
  }

  //get credential component
  async getCredentialComponent(
    credentialComponentName: string
  ): Promise<CredentialComponentResponseDTO> {
    return new CredentialComponentResponseDTO(
      await this.credentialComponentRepository.getCredentialComponentByCredentialName(
        credentialComponentName
      )
    );
  }
}
