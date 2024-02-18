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
  deletedAt?: string | null;
  version: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  userId: string;
  permissionId: string;
  refId?: string | null;
  permission: Permission;
}

interface Permission {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  version: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  type: string;
}

interface UserRole {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  version: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  userId: string;
  roleId: string;
  role: Role;
}

interface Role {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  version: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  type: string;
  name: string;
  description: string;
}
