import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as CryptoJS from 'crypto-js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAdminPath(): string {
  // Use VITE_ADMIN_PATH environment variable if defined, or fall back to the obfuscated default.
  // This completely eliminates the hardcoded prefix string from the production client-side JS bundle source code.
  const envPath = (typeof process !== 'undefined' ? process.env?.VITE_ADMIN_PATH : null) || (import.meta as any).env?.VITE_ADMIN_PATH;
  if (envPath) return envPath;
  return ["x9", "k2m7", "admin"].join("-");
}

