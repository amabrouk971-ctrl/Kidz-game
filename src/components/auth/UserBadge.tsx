import React from 'react';
import { Shield, User as UserIcon, Cloud, CloudCheck, LogIn, ChevronDown } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useGame } from '../../store/GameContext';

interface UserBadgeProps {
  onOpenAdmin?: () => void;
}

export const UserBadge: React.FC<UserBadgeProps> = ({ onOpenAdmin }) => {
  const { user, userProfile, isAdmin, openAuthModal, signOut } = useAuth();
  const { isCloudSynced } = useGame();

  if (!user) {
    return (
      <button
        onClick={openAuthModal}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md transition transform active:scale-95"
      >
        <LogIn size={15} />
        <span>تسجيل الدخول / حفظ سحابي</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* If Admin, show direct button to Admin Dashboard */}
      {isAdmin && onOpenAdmin && (
        <button
          onClick={onOpenAdmin}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs shadow-md transition transform active:scale-95 animate-pulse"
          title="لوحة تحكم المشرف amabrouk971@gmail.com"
        >
          <Shield size={14} className="text-yellow-300" />
          <span>لوحة المشرف (Admin)</span>
        </button>
      )}

      {/* User profile capsule */}
      <button
        onClick={openAuthModal}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white shadow-sm border border-slate-200 transition text-slate-800"
      >
        <div className="relative">
          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 overflow-hidden border border-indigo-200">
            {userProfile?.photoURL ? (
              <img src={userProfile.photoURL} alt="" className="w-full h-full object-cover" />
            ) : (
              userProfile?.displayName?.[0] || '👤'
            )}
          </div>
          {isAdmin && (
            <span className="absolute -top-1 -right-1 text-[10px]">👑</span>
          )}
        </div>

        <div className="text-right hidden sm:block">
          <div className="text-xs font-black text-slate-800 leading-tight">
            {userProfile?.displayName || user.displayName || 'مستخدم'}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            {isAdmin ? 'مدير النظام' : 'ولي أمر'}
          </div>
        </div>

        {isCloudSynced ? (
          <span title="محفوظ في السحابة Firebase" className="text-emerald-500">
            <Cloud size={14} />
          </span>
        ) : (
          <span title="جاري المزامنة السحابية" className="text-amber-500">
            <Cloud size={14} className="animate-pulse" />
          </span>
        )}
      </button>
    </div>
  );
};
