import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, In, Repository } from 'typeorm';
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
    },
    tenantIds?: string[]
  ): Promise<Credential> {
    const credential = await this.findOne({
      where: { id: credentialId, tenantId: In(tenantIds) },
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
    },
    tenantIds: string[],
    name?: string
  ) {
    const credentials = await this.find({
      where: {
        tenantId: In(tenantIds),
        credentialName: name,
      },
      withDeleted: options.withDeleted,
      order: {
        createdAt: 'DESC',
      },
    });
    return credentials;
  }
}
