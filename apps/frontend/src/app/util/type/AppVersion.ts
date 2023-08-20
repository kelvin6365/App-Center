import { File } from './File';

export interface AppVersion {
  id: string;
  name: string;
  description: string;
  fileId: string;
  fileURL: string;
  createdAt: string;
  updatedAt: string;
  tags: AppVersionTag[];
  file: File;
  appId: string;
}

export interface AppVersionTag {
  id: string;
  name: string;
  createdAt: string;
  appId: string;
}
