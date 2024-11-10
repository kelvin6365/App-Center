import { Permission } from '../entities/permission.entity';

export class PermissionDTO {
  id: string;
  type: string;
  refId: string;
  constructor(partial: Partial<Permission>, refId: string) {
    this.id = partial.id;
    this.type = partial.type;
    this.refId = refId;
  }
}
