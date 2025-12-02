import { mockApi } from './mockStore';
import { firebaseApi } from './firebaseService';

// --- CONFIGURATION ---
// Switched to true to use the keys you pasted
const USE_FIREBASE = true;

export const api = USE_FIREBASE ? firebaseApi : mockApi;