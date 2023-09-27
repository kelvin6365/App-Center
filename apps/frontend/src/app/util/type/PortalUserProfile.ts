export interface PortalUserProfile {
  id: string;
  username: string;
  status: string;
  roles: Role[];
  profile: Profile;
  permissions: Permission[];
  tenants: {
    id: string;
    name: string;
  }[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: any;
}

interface Permission {
  id: string;
  type: string;
  refId?: any;
}

interface Profile {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: any;
  version: number;
  createdBy?: any;
  updatedBy?: any;
  name: string;
  email: string;
  extra?: any;
  userId: string;
  avatarId?: any;
  avatar?: any;
}

interface Role {
  type: string;
  name: string;
  description: string;
}
