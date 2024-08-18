export type Plan = {
  id: string;
  name: {
    [key: string]: string;
  };
  description: {
    [key: string]: string;
  };
  maxTenants: number;
  appCreationLimit: number;
  storageLimit: number;
};
