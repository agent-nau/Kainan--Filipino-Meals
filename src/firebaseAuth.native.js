import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';

let authInstance;

export function getFirebaseAuth(app) {
  if (authInstance?.app === app) return authInstance;
  try {
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    if (error?.code !== 'auth/already-initialized') throw error;
    authInstance = getAuth(app);
  }
  return authInstance;
}
