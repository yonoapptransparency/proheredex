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
            apiKey: process.env.VITE_FIREBASE_API_KEY || import.meta.env?.VITE_FIREBASE_API_KEY || "",
            authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "",
            projectId: process.env.VITE_FIREBASE_PROJECT_ID || import.meta.env?.VITE_FIREBASE_PROJECT_ID || "",
            storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "",
            messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
            appId: process.env.VITE_FIREBASE_APP_ID || import.meta.env?.VITE_FIREBASE_APP_ID || "",
            firestoreDatabaseId: process.env.VITE_FIREBASE_DATABASE_ID || import.meta.env?.VITE_FIREBASE_DATABASE_ID || "(default)"
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
