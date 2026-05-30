import CryptoJS from 'crypto-js';

// Derive a unique key to make it harder to guess or decrypt externally
const getStorageSecret = (): string => {
  const base = "RUMMY_PORTAL_CLIENT_SEC_2026_PROD_SHIELD";
  return base + "_KINETICS_HASH_4917";
};

// Obfuscate local storage keys so they aren't easily searchable (e.g. from extensions)
export function getObfuscatedKey(key: string): string {
  if (key.startsWith('rummystore_')) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash |= 0;
    }
    return `_rs_sec_chunk_${Math.abs(hash).toString(16)}`;
  }
  return key;
}

export const secureStorage = {
  getItem: (key: string): string | null => {
    try {
      const realKey = getObfuscatedKey(key);
      const raw = localStorage.getItem(realKey);
      if (!raw) {
        // Fallback check to ease migration from legacy plain-text schema if present,
        // then immediately encrypt on next save.
        const legacyRaw = localStorage.getItem(key);
        if (legacyRaw) {
          try {
            // Check if legacy raw is valid JSON, if so return it
            JSON.parse(legacyRaw);
            return legacyRaw;
          } catch (_) {}
        }
        return null;
      }
      
      // Decrypt AES ciphertext
      const keyString = getStorageSecret();
      const bytes = CryptoJS.AES.decrypt(raw, keyString);
      const plainText = bytes.toString(CryptoJS.enc.Utf8);
      return plainText || null;
    } catch (e) {
      console.warn("Secure storage read fallback:", e);
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    try {
      const realKey = getObfuscatedKey(key);
      const keyString = getStorageSecret();
      
      // Encrypt plainText to AES ciphertext
      const ciphertext = CryptoJS.AES.encrypt(value, keyString).toString();
      localStorage.setItem(realKey, ciphertext);
      
      // Clean up legacy plain text if present
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn("Secure storage write failed:", e);
    }
  },
  
  removeItem: (key: string): void => {
    try {
      const realKey = getObfuscatedKey(key);
      localStorage.removeItem(realKey);
      localStorage.removeItem(key); // Also clean up legacy plain-text entry if any
    } catch (e) {
      console.warn("Secure storage delete failed:", e);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn("Storage clear failed:", e);
    }
  }
};
