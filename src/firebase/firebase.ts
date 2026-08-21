import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAkvGA4e3ZgYyj7UK2oNMHyiFdwZge75dE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "quadratic-aquifer-fwjkk.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "quadratic-aquifer-fwjkk",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "quadratic-aquifer-fwjkk.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "148328398597",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:148328398597:web:40e00ca1ed603251b4c16c",
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export default app;
