import { ApiProperty } from '@nestjs/swagger';
import { Tenant } from '../entities/tenant.entity';

export class TenantDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;

  constructor(partial: Partial<Tenant>) {
    this.id = partial.id;
    this.name = partial.name;
  }
}
