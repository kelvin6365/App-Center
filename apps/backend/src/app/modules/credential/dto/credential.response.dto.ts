import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Credential } from '../entities/credential.entity';

export class CredentialResponseDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  credentialName: string;
  @ApiProperty()
  encryptedData: Record<string, unknown>;
  @ApiProperty()
  tenantId: string;

  constructor(partial: Partial<Credential>) {
    this.id = partial.id;
    this.name = partial.name;
    this.credentialName = partial.credentialName;
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;
    if (partial.encryptedData) {
      this.encryptedData = JSON.parse(partial.encryptedData);
    }
    this.tenantId = partial.tenantId;
  }
}
