export class Credential {
  id?: string;
  name!: string;
  credentialName!: string;
  createdAt?: string;
  updatedAt?: string;
}
export class CredentialWithEncryptedData<T> extends Credential {
  encryptedData?: T;
}

export class AzureOpenAI {
  azureOpenAIApiKey?: string;
}

export class AzureOpenAICredential extends CredentialWithEncryptedData<AzureOpenAI> {}
