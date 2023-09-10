export interface CredentialComponent {
  label: string;
  name: string;
  version: number;
  description: string;
  icon: string;
  inputs: CredentialComponentInput[];
}

export interface CredentialComponentInput {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
}
