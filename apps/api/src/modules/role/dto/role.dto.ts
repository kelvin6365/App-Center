import { UserRole } from '../../user/entities/user.role.entity';
import { RoleType } from '../enum/role.type.enum';

export class RoleDTO {
  type: RoleType;
  name: string;
  description: string;
  tenantId: string;
  constructor(partial: Partial<UserRole>) {
    this.type = partial.role.type;
    this.name = partial.role.name;
    this.description = partial.role.description;
    this.tenantId = partial.tenantId;
  }
}
