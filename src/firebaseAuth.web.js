import { getAuth } from 'firebase/auth';

export function getFirebaseAuth(app) {
  return getAuth(app);
}
