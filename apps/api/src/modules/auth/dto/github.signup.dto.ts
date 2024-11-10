export class GithubSignupDto {
  username: string;
  email: string;
  name: string;
  providerId: string;
  constructor({
    username,
    email,
    name,
    providerId,
  }: {
    username: string;
    email: string;
    name: string;
    providerId: string;
  }) {
    this.username = username;
    this.email = email;
    this.name = name;
    this.providerId = providerId;
  }
}
