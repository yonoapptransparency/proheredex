import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore with long polling and stream-disabling for maximum compatibility in restricted networks
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false // Disabling fetch streams often fixes connection issues in sandboxes
}, firebaseConfig.firestoreDatabaseId === "(default)" ? undefined : firebaseConfig.firestoreDatabaseId);
