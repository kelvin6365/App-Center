import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CredentialComponent } from '../../modules/credential/entities/credential.component.entity';

@Injectable()
export class CredentialComponentRepository extends Repository<CredentialComponent> {
  constructor(dataSource: DataSource) {
    super(CredentialComponent, dataSource.createEntityManager());
  }
  //Get By credentialName
  async getCredentialComponentByCredentialName(
    credentialName: string,
    withDeleted = false
  ): Promise<CredentialComponent> {
    return await this.findOne({
      where: {
        name: credentialName,
      },
      withDeleted,
    });
  }

  //Get All credential components
  async getAllCredentialComponents(
    withDeleted = false
  ): Promise<CredentialComponent[]> {
    return await this.find({
      withDeleted,
    });
  }
}
