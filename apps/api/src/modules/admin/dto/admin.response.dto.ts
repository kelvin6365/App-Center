import { ApiProperty } from '@nestjs/swagger';
import { Admin } from '../entities/admin.entity';

export class AdminResponseDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  status: string;
  constructor(data: Partial<Admin>) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.status = data.status;
  }
}
