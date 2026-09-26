import { getFirestore } from 'firebase/firestore';
import app, { firebaseConfig } from './firebase';

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export default db;
