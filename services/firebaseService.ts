import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { User, Project, Insight, FundingOpportunity, Comment, UserRole } from '../types';

// --- PASTE YOUR FIREBASE CONFIG HERE ---
const firebaseConfig = {
  apiKey: "AIzaSyCpdzQPRWYtEKX_Y2iF0hYPMYrV4LCGBmM",
  authDomain: "ponsectors.firebaseapp.com",
  projectId: "ponsectors",
  storageBucket: "ponsectors.firebasestorage.app",
  messagingSenderId: "133436560034",
  appId: "1:133436560034:web:cf74e9202d6d453f9bbdfb",
  measurementId: "G-2LYHNED6PG"
};

// Initialize Firebase
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
const auth = firebase.auth();
const db = firebase.firestore();

// HARDCODED ADMIN EMAILS - These users will ALWAYS be treated as Admins by the frontend
const ADMIN_EMAILS = [
  'admin@ponsectors.com', 
  'admin@ponsectdors.com'
];

export const firebaseApi = {
  users: {
    getAll: async () => {
      if (!db) return [];
      const snapshot = await db.collection('users').get();
      return snapshot.docs.map(d => d.data() as User);
    },
    getById: async (id: string) => {
      if (!db) return undefined;
      const docSnap = await db.collection('users').doc(id).get();
      if (docSnap.exists) {
        return docSnap.data() as User;
      }
      return undefined;
    },
    create: async (user: User) => {
      if (!db || !auth) throw new Error("Firebase not connected");
      
      try {
        // 1. Create the Authentication Account
        const userCredential = await auth.createUserWithEmailAndPassword(user.email, user.passwordHash);
        const uid = userCredential.user?.uid;
        if (!uid) throw new Error("User creation failed");

        // 2. Prepare data for Firestore (remove sensitive password field)
        const userForDb = { ...user, id: uid };
        // @ts-ignore
        delete userForDb.passwordHash; 

        // 3. Save Profile to Firestore using the Auth UID as the document ID
        await db.collection('users').doc(uid).set(userForDb);
        
        return { ...user, id: uid };
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
           throw new Error("This email is already registered.");
        }
        throw error;
      }
    },
    update: async (user: User) => {
      if (!db) return;
      const { passwordHash, ...dataToUpdate } = user;
      await db.collection('users').doc(user.id).update(dataToUpdate);
    },
    login: async (email: string, pass: string) => {
      if (!auth || !db) throw new Error("Firebase not connected");
      
      try {
        // 1. Authenticate
        const cred = await auth.signInWithEmailAndPassword(email, pass);
        const uid = cred.user?.uid;
        if (!uid) throw new Error("Login failed");
        
        // 2. Fetch Profile
        const docSnap = await db.collection('users').doc(uid).get();
        
        if (docSnap.exists) {
          const userData = docSnap.data() as User;
          
          // --- ADMIN OVERRIDE ---
          // Force Admin role in memory if email matches allow-list.
          // This ensures access even if DB write failed or is slow.
          if (ADMIN_EMAILS.includes(userData.email.toLowerCase())) {
             userData.role = UserRole.ADMIN;
             
             // Try to sync this back to DB in background (fire and forget)
             db.collection('users').doc(uid).update({ role: UserRole.ADMIN }).catch(console.error);
          }

          return userData;
        } else {
           throw new Error("User profile not found.");
        }
      } catch (error: any) {
         if (error.code === 'auth/invalid-credential') {
             throw new Error("Invalid email or password.");
         }
         throw error;
      }
    },
    toggleSave: async (userId: string, projectId: string) => {
      if (!db) throw new Error("No DB");
      const userRef = db.collection('users').doc(userId);
      const doc = await userRef.get();
      if (!doc.exists) throw new Error("User not found");
      const user = doc.data() as User;
      const saved = user.savedProjectIds || [];
      let newSaved: string[];
      if (saved.includes(projectId)) {
          newSaved = saved.filter(id => id !== projectId);
      } else {
          newSaved = [...saved, projectId];
      }
      await userRef.update({ savedProjectIds: newSaved });
      return { ...user, savedProjectIds: newSaved };
    },
    getCurrentUser: async () => {
      return new Promise<User | null>((resolve) => {
        if (!auth || !db) { resolve(null); return; }
        const unsubscribe = auth.onAuthStateChanged(async (fbUser) => {
            if (fbUser) {
                const docSnap = await db.collection('users').doc(fbUser.uid).get();
                if (docSnap.exists) {
                    const userData = docSnap.data() as User;
                    
                    // --- ADMIN OVERRIDE ---
                    if (ADMIN_EMAILS.includes(userData.email.toLowerCase())) {
                        userData.role = UserRole.ADMIN;
                    }
                    
                    resolve(userData);
                } else {
                    resolve(null);
                }
            } else {
                resolve(null);
            }
            unsubscribe();
        });
      });
    },
    setCurrentUser: async (id: string | null) => {
       if (!auth) return;
       if (!id) await auth.signOut();
    }
  },

  projects: {
    getAll: async () => {
      if (!db) return [];
      const snapshot = await db.collection('projects').get();
      return snapshot.docs.map(d => d.data() as Project);
    },
    create: async (project: Project) => {
      if (!db) throw new Error("No DB");
      await db.collection('projects').doc(project.id).set(project);
      return project;
    },
    update: async (project: Project) => {
      if (!db) return;
      // Explicitly use set with merge: true to save partial updates or full object replacements
      await db.collection('projects').doc(project.id).set(project, { merge: true });
    },
    delete: async (id: string) => {
      if (!db) return;
      await db.collection('projects').doc(id).delete();
    }
  },

  insights: {
    getAll: async () => {
      if (!db) return [];
      const snapshot = await db.collection('insights').get();
      return snapshot.docs.map(d => d.data() as Insight);
    },
    create: async (insight: Insight) => {
        if (!db) throw new Error("No DB");
        await db.collection('insights').doc(insight.id).set(insight);
        return insight;
    },
    update: async (insight: Insight) => {
        if (!db) return;
        await db.collection('insights').doc(insight.id).set(insight, { merge: true });
    },
    delete: async (id: string) => {
        if (!db) return;
        await db.collection('insights').doc(id).delete();
    }
  },

  funding: {
    getAll: async () => {
      if (!db) return [];
      const snapshot = await db.collection('funding').get();
      return snapshot.docs.map(d => d.data() as FundingOpportunity);
    },
    create: async (opp: FundingOpportunity) => {
        if (!db) throw new Error("No DB");
        await db.collection('funding').doc(opp.id).set(opp);
        return opp;
    },
    update: async (opp: FundingOpportunity) => {
        if (!db) return;
        await db.collection('funding').doc(opp.id).set(opp, { merge: true });
    },
    delete: async (id: string) => {
        if (!db) return;
        await db.collection('funding').doc(id).delete();
    }
  },

  comments: {
    getByParent: async (parentId: string) => {
      if (!db) return [];
      const snapshot = await db.collection('comments').where('parentId', '==', parentId).get();
      return snapshot.docs.map(d => d.data() as Comment);
    },
    add: async (comment: Comment) => {
      if (!db) throw new Error("No DB");
      await db.collection('comments').doc(comment.id).set(comment);
      return comment;
    }
  }
};