import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, Shield, Sparkles, LogIn, UserPlus, CheckCircle } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { ADMIN_EMAIL } from '../../lib/firebase/firebase';
import { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    error,
    clearError,
    loading,
    user,
    userProfile,
    signOut
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('parent');
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    clearError();

    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, displayName, role);
      }
    } catch (err) {
      // Error is set in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    clearError();
    try {
      await signInWithGoogle();
    } catch (err) {
      // Handled in context
    } finally {
      setSubmitting(false);
    }
  };

  const fillAdminEmail = () => {
    setEmail(ADMIN_EMAIL);
    setPassword('admin123456');
    setMode('signin');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
          dir="rtl"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-l from-indigo-600 via-purple-600 to-pink-500 p-6 text-white text-center relative">
            <button
              onClick={closeAuthModal}
              className="absolute left-4 top-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition text-white"
              title="إغلاق"
            >
              <X size={20} />
            </button>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md mb-3 shadow-inner">
              <Sparkles size={28} className="text-yellow-300 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black mb-1">
              {user ? 'حسابك في المنصة' : mode === 'signin' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
            </h2>
            <p className="text-sm text-indigo-100 font-medium">
              {user
                ? 'بياناتك ومستويات أطفالك محفوظة سحابياً بأمان'
                : 'احفظ تقدم أطفالك والنجوم والمكافآت في السحابة'}
            </p>
          </div>

          {/* Body */}
          <div className="p-6">
            {user ? (
              /* Already Signed In View */
              <div className="text-center space-y-4 py-2">
                <div className="w-16 h-16 rounded-full bg-indigo-100 border-2 border-indigo-300 flex items-center justify-center text-3xl mx-auto shadow-sm">
                  {userProfile?.photoURL ? (
                    <img src={userProfile.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    '👤'
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">
                    {userProfile?.displayName || user.displayName || 'مستخدم مسجل'}
                  </h3>
                  <p className="text-sm text-slate-500 font-mono mt-0.5">{user.email}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700">
                    {userProfile?.role === 'admin' ? (
                      <>
                        <Shield size={14} className="text-amber-500" />
                        <span>مدير النظام الكامل (Admin)</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={14} className="text-emerald-500" />
                        <span>ولي أمر / مستخدم</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-3">
                  <button
                    onClick={closeAuthModal}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition text-sm"
                  >
                    متابعة اللعب
                  </button>
                  <button
                    onClick={async () => {
                      await signOut();
                      closeAuthModal();
                    }}
                    className="py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold transition text-sm"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              </div>
            ) : (
              /* Not Signed In: Login / Register Form */
              <div>
                {/* Google Sign-In Button */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading || submitting}
                  type="button"
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-400 bg-white hover:bg-slate-50 font-bold text-slate-700 shadow-sm transition disabled:opacity-60"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>متابعة بحساب Google</span>
                </button>

                <div className="relative my-4 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <span className="relative px-3 bg-white text-xs font-bold text-slate-400">
                    أو بالبريد الإلكتروني
                  </span>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-4 text-sm font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      clearError();
                    }}
                    className={`py-2 rounded-lg transition ${
                      mode === 'signin'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    تسجيل الدخول
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      clearError();
                    }}
                    className={`py-2 rounded-lg transition ${
                      mode === 'signup'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    حساب جديد
                  </button>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">اسمك / اللقب</label>
                      <div className="relative">
                        <UserIcon className="absolute right-3 top-3 text-slate-400" size={18} />
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="مثال: بابا أحمد / أم سارة"
                          className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm outline-none transition"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">البريد الإلكتروني</label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 text-slate-400" size={18} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm outline-none transition dir-ltr text-left"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">كلمة المرور</label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 text-slate-400" size={18} />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm outline-none transition dir-ltr text-left"
                      />
                    </div>
                  </div>

                  {mode === 'signup' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">نوع الحساب</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 text-sm bg-white font-medium"
                      >
                        <option value="parent">👨‍👩‍👧 ولي أمر (حفظ أطفالك ومتابعتهم)</option>
                        <option value="user">👤 مستخدم عادي</option>
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || loading}
                    className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-l from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submitting ? (
                      <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : mode === 'signin' ? (
                      <>
                        <LogIn size={18} />
                        <span>تسجيل الدخول</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={18} />
                        <span>إنشاء الحساب</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Hint for Admin Email */}
                <div className="mt-4 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-amber-800">
                    <Shield size={14} className="text-amber-600" />
                    <span>بريد المشرف: <b>{ADMIN_EMAIL}</b></span>
                  </div>
                  <button
                    type="button"
                    onClick={fillAdminEmail}
                    className="px-2 py-1 rounded-lg bg-amber-200/70 hover:bg-amber-300 text-amber-900 font-bold transition text-[11px]"
                  >
                    ملء تجريبي
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
