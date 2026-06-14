import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, loadEnv, Plugin} from 'vite';

function fallbackFirebaseConfig(): Plugin {
  return {
    name: 'fallback-firebase-config',
    resolveId(id) {
      if (id.endsWith('firebase-applet-config.json')) {
        const filePath = path.resolve(__dirname, 'firebase-applet-config.json');
        if (!fs.existsSync(filePath)) {
          return id;
        }
      }
    },
    load(id) {
      if (id.endsWith('firebase-applet-config.json')) {
        const filePath = path.resolve(__dirname, 'firebase-applet-config.json');
        if (!fs.existsSync(filePath)) {
          return `export default {
            apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "AIzaSyBey9sUbeWlrcXS2kl4ewOzkTy4arg03Ok",
            authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0825832493.firebaseapp.com",
            projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0825832493",
            storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0825832493.firebasestorage.app",
            messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "103973989874",
            appId: import.meta.env?.VITE_FIREBASE_APP_ID || "1:103973989874:web:733a6afd8e837224900f6b",
            firestoreDatabaseId: import.meta.env?.VITE_FIREBASE_DATABASE_ID || "ai-studio-886315a4-8b9f-4ff6-8986-a90ad172210a"
          };`
        }
      }
    }
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), fallbackFirebaseConfig()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
