import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, Shield, Mail, User } from 'lucide-react';
import { UserRole } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (userData: { email: string; displayName: string; role: UserRole }) => Promise<void>;
}

export const AddUserModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('parent');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      alert('يرجى إدخال بريد إلكتروني صالح.');
      return;
    }
    setLoading(true);
    try {
      await onAdd({ email: email.trim(), displayName: displayName.trim(), role });
      setEmail('');
      setDisplayName('');
      setRole('parent');
      onClose();
    } catch (err) {
      console.error('Error adding user doc:', err);
      alert('حدث خطأ أثناء إضافة المستخدم لقاعدة البيانات.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                <UserPlus size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">إضافة مستخدم جديد</h3>
                <p className="text-xs text-slate-400">حفظ في قاعدة بيانات Firestore مباشرة</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">البريد الإلكتروني *</label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 text-slate-400" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full pr-10 pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 dir-ltr text-right"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">اسم الحساب / ولي الأمر</label>
              <div className="relative">
                <User className="absolute right-3 top-3 text-slate-400" size={16} />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="مثال: الأستاذ أحمد"
                  className="w-full pr-10 pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">نوع الصلاحية (Role)</label>
              <div className="relative">
                <Shield className="absolute right-3 top-3 text-slate-400" size={16} />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full pr-10 pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 font-bold"
                >
                  <option value="parent">ولي أمر (Parent) - إدارة أطفاله ومتابعة النتائج</option>
                  <option value="admin">مشرف نظام (Admin) - تحكم كامل بكل شيء</option>
                  <option value="user">مستخدم عام (User)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-lg disabled:opacity-50"
              >
                {loading ? 'جاري الإضافة...' : 'حفظ في قاعدة البيانات'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
