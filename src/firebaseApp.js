import { getApp, getApps, initializeApp } from 'firebase/app';

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL
    || (process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID
      ? `https://${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.asia-southeast1.firebasedatabase.app`
      : undefined),
};

const requiredConfig = ['apiKey', 'authDomain', 'projectId', 'appId'];

export function getFirebaseApp() {
  const missing = requiredConfig.filter((key) => !config[key]);
  if (missing.length) {
    throw new Error(
      `Firebase is not configured.`,
    );
  }

  return getApps().length ? getApp() : initializeApp(config);
}
