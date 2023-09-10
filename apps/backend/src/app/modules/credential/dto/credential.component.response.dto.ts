import { ApiProperty } from '@nestjs/swagger';
import { CredentialComponent } from '../entities/credential.component.entity';

export class CredentialComponentResponseDTO {
  @ApiProperty()
  label: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  version: number;
  @ApiProperty()
  inputs: Record<string, unknown>[];
  constructor(partial: Partial<CredentialComponent>) {
    this.label = partial.label;
    this.name = partial.name;
    this.version = partial.version;
    this.inputs = partial.inputs;
  }
}
