import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
declare global {
  interface Window {
    __FIREBASE_CONFIG__?: {
      projectId?: string;
      appId?: string;
      apiKey?: string;
      authDomain?: string;
      firestoreDatabaseId?: string;
      storageBucket?: string;
      messagingSenderId?: string;
      measurementId?: string;
    };
  }
}

// Check if local applet config has real keys to fall back on during static SPA deployments
const isLocalConfigValid = false; // We rely exclusively on the injected window.__FIREBASE_CONFIG__ now.

const fallbackConfig = {
  projectId: "placeholder-project-id",
  appId: "placeholder-app-id",
  apiKey: "PLACEHOLDER",
  authDomain: "placeholder-project.firebaseapp.com",
  firestoreDatabaseId: "(default)",
  storageBucket: "placeholder-project.firebasestorage.app",
  messagingSenderId: "000000000",
  measurementId: ""
};

const firebaseConfig = (typeof window !== 'undefined' && window.__FIREBASE_CONFIG__) || fallbackConfig;

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// EXPERIMENTAL FORCE LONG POLLING IS REQUIRED for Indian Mobile ISPs!
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true
}, firebaseConfig.firestoreDatabaseId === '(default)' ? undefined : firebaseConfig.firestoreDatabaseId);

export const isFirebaseConfigured = firebaseConfig.apiKey !== 'PLACEHOLDER' && firebaseConfig.apiKey.trim() !== '' && !firebaseConfig.apiKey.includes('YOUR_API_KEY');



