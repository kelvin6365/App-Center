/* eslint-disable @typescript-eslint/no-explicit-any */
import { RoleType } from "./RoleType";

export interface PortalUserProfile {
  id: string;
  username: string;
  status: string;
  roles: Role[];
  profile: Profile;
  permissions: Permission[];
  tenants: Tenant[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: any;
  subscriptions: Subscription[];
}

interface Permission {
  id: AppsPermission;
  type: string;
  refId?: any;
}

interface Subscription {
  status: string;
  trialEnd: Date;
  currentPeriodEnd: Date;
  currentPeriodStart: Date;
  planId: string;
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

export interface Role {
  type: RoleType;
  name: string;
  description: string;
  tenantId: string;
}

export interface Tenant {
  id: string;
  name: string;
}

export enum AppsPermission {
  VIEW_APP = "98e3ccbf-9450-4809-8bfd-f527b1bfe8fc",
  CREATE_APP = "ecaeafeb-0b11-4bcb-af5c-9a4f15aee1de",
  EDIT_APP = "c710dbe5-d9db-421d-b4b5-7abd04a6cf9d",
  DELETE_APP_VERSION = "b193735b-1918-47a4-9878-1209430d434f",
  CREATE_APP_VERSION = "3f783226-f67e-4062-8566-cbf77c7f8f88",
}
