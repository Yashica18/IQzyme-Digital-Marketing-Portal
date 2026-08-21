import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  companyName?: string;
  phone?: string;
  role?: string;
  createdAt?: any;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, name: string, company?: string, phone?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Sign Up
  async function signUp(email: string, password: string, name: string, company?: string, phone?: string) {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update display name in Firebase Auth
      await updateProfile(user, { displayName: name });
      
      // Create user document in Firestore users collection
      const profileData: UserProfile = {
        uid: user.uid,
        email: user.email || email,
        displayName: name,
        companyName: company || '',
        phone: phone || '',
        role: 'client', // default role
      };

      await setDoc(doc(db, 'users', user.uid), {
        ...profileData,
        createdAt: serverTimestamp(),
      });

      setUserProfile(profileData);
    } catch (err: any) {
      console.error("Sign up failed:", err);
      setError(err.message || 'An error occurred during account registration.');
      throw err;
    }
  }

  // Sign In
  async function signIn(email: string, password: string) {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Profile will be loaded by onAuthStateChanged listener
    } catch (err: any) {
      console.error("Sign in failed:", err);
      setError(err.message || 'Incorrect email or password combination.');
      throw err;
    }
  }

  // Log Out
  async function logOut() {
    setError(null);
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (err: any) {
      console.error("Log out failed:", err);
      setError(err.message || 'Failed to complete log out operation.');
    }
  }

  // Password Reset
  async function resetPassword(email: string) {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      console.error("Password reset failed:", err);
      setError(err.message || 'Failed to send password reset instructions.');
      throw err;
    }
  }

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch Firestore profile
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            if (user.email === 'yashicajindal1806@gmail.com') {
              data.role = 'admin';
            }
            setUserProfile(data);
          } else {
            // Document might not exist if sign-up crashed mid-operation
            const profileData: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'IQzyme Client',
              role: (user.email === 'yashicajindal1806@gmail.com') ? 'admin' : 'client',
            };
            setUserProfile(profileData);
          }
        } catch (err) {
          console.error("Error loading user profile doc:", err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    logOut,
    resetPassword,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
