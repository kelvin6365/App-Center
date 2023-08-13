/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_HOST: string;
  readonly VITE_ENV: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
