export interface Profile {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  username: string;
  deletedAt?: any;
  status: string;
  roles: UserRole[];
  name: string;
  permissions: UserPermission[];
  tenants: string[];
}

interface UserPermission {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: any;
  version: number;
  createdBy?: any;
  updatedBy?: any;
  userId: string;
  permissionId: string;
  refId?: any;
  permission: Permission;
}

interface Permission {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: any;
  version: number;
  createdBy?: any;
  updatedBy?: any;
  type: string;
}

interface UserRole {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: any;
  version: number;
  createdBy?: any;
  updatedBy?: any;
  userId: string;
  roleId: string;
  role: Role;
}

interface Role {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: any;
  version: number;
  createdBy?: any;
  updatedBy?: any;
  type: string;
  name: string;
  description: string;
}
