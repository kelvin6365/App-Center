import { PermissionDTO } from '../../permission/dto/permission.dto';
import { RoleDTO } from '../../role/dto/role.dto';
import { User } from '../entities/user.entity';
import { UserStatus } from '../enum/user.status.enum';

export class PortalUserResponseDTO {
  id: string;
  username: string;
  status: UserStatus;
  roles: RoleDTO[];
  profile: any;
  permissions: PermissionDTO[];
  tenants: string[];
  constructor(partial: Partial<User>) {
    this.id = partial.id;
    this.username = partial.username;
    this.status = partial.status;
    this.roles = partial.roles?.map((role) => new RoleDTO(role.role));
    this.profile = partial.profile;
    this.permissions = partial.permissions?.map(
      (permission) => new PermissionDTO(permission.permission, permission.refId)
    );
    this.tenants = partial.tenants?.map((tenant) => tenant.id);
  }
}
