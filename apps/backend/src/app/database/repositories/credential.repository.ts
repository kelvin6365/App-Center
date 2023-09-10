import { DataSource, DeleteResult, Repository } from 'typeorm';
import { Credential } from '../../modules/credential/entities/credential.entity';
import { Injectable } from '@nestjs/common';
import {
  decryptCredentialData,
  encryptCredentialData,
} from '../../common/util/util';

@Injectable()
export class CredentialRepository extends Repository<Credential> {
  constructor(dataSource: DataSource) {
    super(Credential, dataSource.createEntityManager());
  }
  //Create Credential
  async createCredential(credential: Credential): Promise<Credential> {
    //Encrypt
    credential.encryptedData = await encryptCredentialData(
      credential.encryptedData
    );
    return await this.save(credential);
  }

  //Get Credential
  async getCredential(
    credentialId: string,
    options: { withDeleted?: boolean } = {
      withDeleted: false,
    }
  ): Promise<Credential> {
    const credential = await this.findOne({
      where: { id: credentialId },
      withDeleted: options.withDeleted,
    });

    return credential;
  }

  //Update Credential
  async updateCredential(credential: Credential): Promise<Credential> {
    //Encrypt
    credential.encryptedData = await encryptCredentialData(
      credential.encryptedData
    );
    return await this.save(credential);
  }

  //Delete Credential
  async deleteCredential(
    credentialId: string,
    updatedBy?: string
  ): Promise<DeleteResult> {
    if (updatedBy) {
      await this.update(credentialId, { updatedBy });
    }
    return await this.softDelete({ id: credentialId });
  }

  //Get All Credential
  async getAllCredential(options?: { withDeleted?: false; decrypt?: false }) {
    const credentials = await this.find({
      withDeleted: options.withDeleted,
    });
    if (options.decrypt) {
      credentials.forEach(async (credential) => {
        credential.encryptedData = await decryptCredentialData(
          credential.encryptedData
        );
      });
    }
    return credentials;
  }
}
