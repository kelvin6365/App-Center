import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { Credential } from '../../modules/credential/entities/credential.entity';

@Injectable()
export class CredentialRepository extends Repository<Credential> {
  constructor(dataSource: DataSource) {
    super(Credential, dataSource.createEntityManager());
  }
  //Create Credential
  async createCredential(credential: Credential): Promise<Credential> {
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
  async getAllCredentialWithoutEncryptedData(
    options: { withDeleted?: boolean } = {
      withDeleted: false,
    }
  ) {
    const credentials = await this.find({
      withDeleted: options.withDeleted,
      order: {
        createdAt: 'DESC',
      },
    });
    return credentials;
  }
}
