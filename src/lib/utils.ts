import * as CryptoJS from 'crypto-js';

export function cn(...inputs: any[]): string {
  return inputs.filter(Boolean).join(' ');
}

export function getAdminPath(): string {
  let envPath = null;
  if (typeof process !== 'undefined') {
    envPath = process.env?.VITE_ADMIN_PATH;
  }
  if (envPath) return envPath;
  return ["x9", "k2", "m7", "admin"].join("-");
}
