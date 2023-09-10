import { Injectable } from '@nestjs/common';
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
    private credentialRepository: CredentialRepository,
    private credentialComponentRepository: CredentialComponentRepository
  ) {}

  //Get all Credentials
  async getAllCredentials(): Promise<CredentialResponseDTO[]> {
    const credentials =
      await this.credentialRepository.getAllCredentialWithoutEncryptedData();
    return credentials.map(
      (credential) =>
        new CredentialResponseDTO(omit(credential, ['encryptedData']))
    );
  }

  //Get credential
  async getCredential(credentialId: string): Promise<CredentialResponseDTO> {
    const credential = await this.credentialRepository.getCredential(
      credentialId
    );
    //get credential component
    const credentialComponent =
      await this.credentialComponentRepository.getCredentialComponentByCredentialName(
        credential.credentialName
      );

    credential.encryptedData = await decryptCredentialData(
      credential.encryptedData,
      credential.credentialName,
      { [credential.credentialName]: credentialComponent }
    );
    return new CredentialResponseDTO(credential);
  }

  //Create credential
  async createCredential(
    credential: CreateCredentialRequestDTO,
    user: CurrentUserDTO
  ): Promise<boolean> {
    const newCredential = new Credential();
    newCredential.name = credential.name;
    newCredential.credentialName = credential.credentialName;
    newCredential.encryptedData = credential.encryptedData;
    if (user.id) {
      newCredential.createdBy = user.id;
    }
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
      await this.credentialRepository.deleteCredential(credentialId, user.id);
      return true;
    } catch (error) {
      throw new AppException(ResponseCode.STATUS_1015_FAIL_TO_DELETE);
    }
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
