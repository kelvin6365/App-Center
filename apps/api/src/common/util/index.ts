import crypto from 'crypto';

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
