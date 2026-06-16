import * as CryptoJS from 'crypto-js';

export function cn(...inputs: any[]): string {
  return inputs.filter(Boolean).join(' ');
}

export function getAdminPath(): string {
  // Admin route now defaults to /admin - security is heavily enforced via FireAuth and lockouts
  // rather than through trivial security-by-obscurity.
  return (import.meta as any).env?.VITE_ADMIN_PATH || "admin";
}
