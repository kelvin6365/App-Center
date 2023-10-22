/// <reference types="vite/client" />

import { PortalUserProfile } from './app/util/type/PortalUserProfile';

interface ImportMetaEnv {
  readonly VITE_API_HOST: string;
  readonly VITE_ENV: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends PortalUserProfile> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setUserAppPermissions: (old: any, current: any) => void;
  }
}
