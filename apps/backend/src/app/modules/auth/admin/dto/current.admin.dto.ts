import { ApiProperty } from '@nestjs/swagger';
import { AdminStatus } from '../../../admin/enum/admin.status.enum';
import { Admin } from '../../../admin/entities/admin.entity';

export class CurrentAdminDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ type: AdminStatus })
  status: AdminStatus;

  @ApiProperty()
  deletedAt: Date;

  constructor(entity: Admin) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.email = entity.email;
    this.deletedAt = entity.deletedAt;
    this.status = entity.status;
  }
}
