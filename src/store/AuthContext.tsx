import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as updateAuthProfile,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, googleProvider, ADMIN_EMAIL } from '../lib/firebase/firebase';
import {
  syncUserProfile,
  recordSignInLog,
  isUserAdmin
} from '../lib/firebase/dbService';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName: string, role?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const clearError = () => setError(null);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const profile = await syncUserProfile(currentUser);
          setUserProfile(profile);
          await recordSignInLog(profile);
        } catch (err: any) {
          console.error('Error syncing user profile on auth state change:', err);
          // Fallback profile if Firestore throws permission or network error
          const fallbackAdmin = isUserAdmin(currentUser.email);
          setUserProfile({
            uid: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || 'مستخدم',
            role: fallbackAdmin ? 'admin' : 'parent',
            createdAt: Date.now(),
            lastLoginAt: Date.now(),
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const profile = await syncUserProfile(res.user);
      setUserProfile(profile);
      await recordSignInLog(profile);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      let msg = 'فشل تسجيل الدخول باستخدام Google. يرجى المحاولة مرة أخرى.';
      if (err.code === 'auth/popup-closed-by-user') {
        msg = 'تم إغلاق نافذة تسجيل الدخول قبل إتمام العملية.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        msg = 'تم إلغاء الطلب السابق، يرجى المحاولة مجدداً.';
      }
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const profile = await syncUserProfile(res.user);
      setUserProfile(profile);
      await recordSignInLog(profile);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error('Email sign-in error:', err);
      let msg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'بيانات الدخول غير صحيحة. يرجى التأكد من البريد وكلمة المرور.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'صيغة البريد الإلكتروني غير صحيحة.';
      }
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUpWithEmail = useCallback(async (
    email: string,
    pass: string,
    displayName: string,
    role: UserRole = 'parent'
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (displayName.trim()) {
        await updateAuthProfile(res.user, { displayName: displayName.trim() });
      }
      const profile = await syncUserProfile(res.user, role);
      setUserProfile(profile);
      await recordSignInLog(profile);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error('Email sign-up error:', err);
      let msg = 'فشل إنشاء الحساب. يرجى التحقق من البيانات.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'هذا البريد الإلكتروني مسجل بالفعل. يمكنك تسجيل الدخول بدلاً من ذلك.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'كلمة المرور ضعيفة. يجب أن تتكون من 6 أحرف على الأقل.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'صيغة البريد الإلكتروني غير صحيحة.';
      }
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err: any) {
      console.error('Sign-out error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const isAdmin = isUserAdmin(user?.email, userProfile?.role);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isAdmin,
        loading,
        error,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
