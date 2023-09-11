import { Role } from '../entities/role.entity';
import { RoleType } from '../enum/role.type.enum';

export class RoleDTO {
  type: RoleType;
  name: string;
  description: string;
  constructor(partial: Partial<Role>) {
    this.type = partial.type;
    this.name = partial.name;
    this.description = partial.description;
  }
}
