import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, remove, serverTimestamp, set } from 'firebase/database';
import { signInAnonymously } from 'firebase/auth';
import { getFirebaseApp } from './firebaseApp';
import { getFirebaseAuth } from './firebaseAuth';

const RESET_COOLDOWN_KEY = 'kainan.firebaseResetAt.v1';
const RESET_COOLDOWN_MS = 60_000;
let resetInProgress = false;

export function getFirebaseErrorMessage(error) {
  const code = error?.code || 'unknown';
  const guidance = {
    'auth/configuration-not-found': 'Firebase Authentication is not initialized for this project. Open Firebase Console → Authentication and finish setup, enable Anonymous sign-in, and make sure the API key and project ID in .env belong to that same project.',
    'auth/operation-not-allowed': 'Enable Anonymous sign-in in Firebase Console → Authentication → Sign-in method.',
    'auth/invalid-api-key': 'Check that the Firebase API key in .env belongs to this project.',
    'auth/unauthorized-domain': 'Add this app domain under Firebase Authentication → Settings → Authorized domains.',
    'auth/network-request-failed': 'Check your internet connection and try syncing again.',
    'permission-denied': 'Publish database.rules.json to Firebase Realtime Database and confirm Realtime Database is enabled.',
    'database/permission-denied': 'Publish database.rules.json to Firebase Realtime Database and confirm Realtime Database is enabled.',
    'unavailable': 'Firebase is temporarily unavailable. Check your connection and try again.',
  }[code] || 'Check Firebase Console for enabled Anonymous sign-in, an active Realtime Database, its database URL, and the published database.rules.json.';
  const detail = error?.message ? ` Firebase says: ${error.message}` : '';
  return `Cloud save failed (${code}).${detail} ${guidance}`;
}

async function getUserSession() {
  const app = getFirebaseApp();
  const auth = getFirebaseAuth(app);
  await auth.authStateReady();
  const user = auth.currentUser || (await signInAnonymously(auth)).user;
  return { app, user };
}

export async function saveOnboardingProfile(settings) {
  const { app, user } = await getUserSession();
  const profileRef = ref(getDatabase(app), `users/${user.uid}`);
  await set(profileRef, {
    onboarding: settings,
    updatedAt: serverTimestamp(),
  });
}

export async function getResetCooldownRemaining() {
  const savedAt = await AsyncStorage.getItem(RESET_COOLDOWN_KEY);
  if (!savedAt) return 0;
  const elapsed = Date.now() - Number(savedAt);
  if (!Number.isFinite(elapsed) || elapsed < 0) {
    throw new Error('The saved reset cooldown is invalid. Clear app storage and try again.');
  }
  return Math.max(0, RESET_COOLDOWN_MS - elapsed);
}

export async function deleteOnboardingProfile() {
  if (resetInProgress) throw new Error('A reset is already in progress.');
  const remaining = await getResetCooldownRemaining();
  if (remaining > 0) {
    throw new Error(`Please wait ${Math.ceil(remaining / 1000)} seconds before resetting again.`);
  }

  resetInProgress = true;
  try {
    const { app, user } = await getUserSession();
    await AsyncStorage.setItem(RESET_COOLDOWN_KEY, String(Date.now()));
    try {
      await remove(ref(getDatabase(app), `users/${user.uid}`));
    } catch (error) {
      try {
        await AsyncStorage.removeItem(RESET_COOLDOWN_KEY);
      } catch (cleanupError) {
        console.error('Unable to clear the reset cooldown after a failed Firebase deletion.', cleanupError);
      }
      throw error;
    }
  } finally {
    resetInProgress = false;
  }
}
