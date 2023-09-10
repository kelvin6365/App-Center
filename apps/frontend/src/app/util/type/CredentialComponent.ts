export interface CredentialComponent {
  label: string;
  name: string;
  version: number;
  icon: string;
  inputs: CredentialComponentInput[];
}

export interface CredentialComponentInput {
  name: string;
  type: string;
  label: string;
  description: string;
}
