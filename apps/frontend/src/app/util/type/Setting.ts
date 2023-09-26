export interface Setting {
  id: string;
  key: string;
  config: StringValueConfig;
}

export interface StringValueConfig {
  value: string | boolean;
}
