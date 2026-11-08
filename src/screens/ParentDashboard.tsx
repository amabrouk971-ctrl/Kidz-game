import React, { useState, useEffect } from 'react';
import { Shield, Star, LogOut, User, Volume2, VolumeX, Settings2, Cloud, RefreshCw, KeyRound } from 'lucide-react';
import { useGame } from '../store/GameContext';
import { useAuth } from '../store/AuthContext';
import { BigButton } from '../components/ui/BigButton';
import { audioManager } from '../lib/audio/AudioManager';

interface Props {
  onClose: () => void;
}

export const ParentDashboard: React.FC<Props> = ({ onClose }) => {
  const { globalState, resetProgress, isCloudSynced, syncAllToCloud } = useGame();
  const { user, userProfile, isAdmin, openAuthModal, signOut } = useAuth();
  const [selectedProfileId, setSelectedProfileId] = useState(globalState.activeProfileId || globalState.profiles[0]?.id);
  const [confirmReset, setConfirmReset] = useState(false);
  const [syncing, setSyncing] = useState(false);
  
  // Audio state
  const [isMusicMuted, setIsMusicMuted] = useState(audioManager.getIsMusicMuted());
  const [volumes, setVolumes] = useState(audioManager.getVolumes());

  useEffect(() => {
    setIsMusicMuted(audioManager.getIsMusicMuted());
    setVolumes(audioManager.getVolumes());
  }, []);

  const handleVolumeChange = (type: keyof typeof volumes, value: number) => {
    const newVols = { ...volumes, [type]: value };
    setVolumes(newVols);
    audioManager.setVolumes(newVols.music, newVols.voice, newVols.effects, newVols.quran);
  };

  const handleToggleMusic = () => {
    const muted = audioManager.toggleMusic();
    setIsMusicMuted(muted);
  };

  const player = globalState.profiles.find(p => p.id === selectedProfileId) || globalState.profiles[0];

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h} ساعة و ${m} دقيقة`;
    return `${m} دقيقة`;
  };

  const handleReset = () => {
    if (confirmReset) {
      resetProgress(); // Resets current active profile
      setConfirmReset(false);
      onClose();
    } else {
      setConfirmReset(true);
    }
  };

  if (!player) return (
    <div className="bg-white rounded-[40px] p-8 max-w-4xl w-full mx-auto rtl text-center">
      <h2 className="text-3xl font-black text-slate-800">لا يوجد بيانات لاعبين.</h2>
      <BigButton onClick={onClose} className="mt-8">رجوع</BigButton>
    </div>
  );

  return (
    <div className="bg-white rounded-[40px] p-8 max-w-4xl w-full mx-auto rtl text-right border-8 border-indigo-300 shadow-2xl relative overflow-hidden mt-10 md:mt-0 mb-10">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b-4 border-gray-100 pb-4 gap-4">
        <h1 className="text-3xl md:text-5xl font-black text-indigo-900 flex items-center gap-3 drop-shadow-sm">
          <Shield className="text-indigo-500" size={40} />
          لوحة تحكم الأهل
        </h1>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 bg-gray-100 rounded-full p-4 flex items-center gap-2">
          <span className="font-bold">خروج</span> <LogOut size={24} />
        </button>
      </div>

      {globalState.profiles.length > 1 && (
        <div className="mb-8 overflow-x-auto pb-4">
          <div className="flex gap-4">
            {globalState.profiles.map(p => (
              <button 
                key={p.id}
                onClick={() => setSelectedProfileId(p.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-full border-4 transition-all whitespace-nowrap ${selectedProfileId === p.id ? 'bg-indigo-100 border-indigo-500 shadow-md' : 'bg-gray-50 border-gray-200'}`}
              >
                <span className="text-2xl">{p.avatar}</span>
                <span className="font-bold text-lg">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Stats */}
        <div className="bg-sky-100 rounded-3xl p-6 border-4 border-sky-300 shadow-inner">
          <h2 className="text-2xl font-black mb-4 text-sky-900 drop-shadow-sm flex items-center gap-2">
            <User /> بيانات {player.name}
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border-2 border-sky-200">
              <span className="text-lg font-bold text-gray-600">وقت اللعب:</span>
              <span className="text-2xl font-black text-sky-600">{formatTime(player.timePlayedSeconds)}</span>
            </div>
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border-2 border-amber-200">
              <span className="text-lg font-bold text-gray-600">النجوم المكتسبة:</span>
              <span className="text-2xl font-black text-amber-500 flex items-center gap-1">
                {player.stars} <Star fill="currentColor" size={24} />
              </span>
            </div>
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border-2 border-green-200">
              <span className="text-lg font-bold text-gray-600">الأنشطة المكتملة:</span>
              <span className="text-2xl font-black text-green-600">{player.completedLevels.length}</span>
            </div>
          </div>
        </div>

        {/* Progress Breakdown */}
        <div className="bg-purple-100 rounded-3xl p-6 border-4 border-purple-300 shadow-inner">
          <h2 className="text-2xl font-black mb-4 text-purple-900 drop-shadow-sm">التقدم التعليمي</h2>
          <div className="space-y-3">
            {[
              { label: 'أساسيات السباحة', val: player.progress.swimming, color: 'bg-blue-500' },
              { label: 'الألوان', val: player.progress.colors, color: 'bg-pink-500' },
              { label: 'الأرقام', val: player.progress.numbers, color: 'bg-green-500' },
              { label: 'الحروف', val: player.progress.letters, color: 'bg-orange-500' },
              { label: 'الأشكال', val: player.progress.shapes, color: 'bg-purple-500' },
              { label: 'الذاكرة', val: player.progress.memory, color: 'bg-teal-500' },
            ].map(item => (
              <div key={item.label} className="bg-white p-3 rounded-2xl shadow-sm border-2 border-purple-200">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-gray-700">{item.label}</span>
                  <span className="font-black text-purple-900">{item.val}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 border border-gray-200 shadow-inner overflow-hidden">
                  <div className={`${item.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${Math.min(item.val, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Skills Dashboard */}
      <div className="mt-8 bg-pink-100 rounded-3xl p-6 border-4 border-pink-300 shadow-inner">
        <h2 className="text-2xl font-black mb-4 text-pink-900 drop-shadow-sm">مهارات اجتماعية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'الأدب والكلمات المهذبة', val: player.progress.politeness, color: 'bg-pink-500' },
            { label: 'مهارات المضيفة (المساعدة)', val: player.progress.flightAcademy, color: 'bg-blue-500' },
          ].map(item => (
            <div key={item.label} className="bg-white p-4 rounded-2xl shadow-sm border-2 border-pink-200">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-gray-700">{item.label}</span>
                <span className="font-black text-pink-900">{item.val}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 border border-gray-200 shadow-inner overflow-hidden mb-1">
                <div className={`${item.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${Math.min(item.val, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Knowledge Adventure Dashboard */}
      <div className="mt-8 bg-amber-100 rounded-3xl p-6 border-4 border-amber-300 shadow-inner">
        <h2 className="text-2xl font-black mb-4 text-amber-900 drop-shadow-sm">عالم المعرفة والاكتشاف</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'حديقة القرآن', val: player.progress.quran, color: 'bg-green-500' },
            { label: 'المعرفة الدينية', val: player.progress.religiousKnowledge, color: 'bg-purple-500' },
            { label: 'مدينة المهن', val: player.progress.professions, color: 'bg-orange-500' },
            { label: 'المعرفة العامة', val: player.progress.generalKnowledge, color: 'bg-teal-500' },
          ].map(item => (
            <div key={item.label} className="bg-white p-4 rounded-2xl shadow-sm border-2 border-amber-200">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-gray-700">{item.label}</span>
                <span className="font-black text-amber-900">{item.val}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 border border-gray-200 shadow-inner overflow-hidden mb-1">
                <div className={`${item.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${Math.min(item.val, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audio Settings */}
      <div className="mt-8 bg-slate-100 rounded-3xl p-6 border-4 border-slate-300 shadow-inner">
        <h2 className="text-2xl font-black mb-6 text-slate-800 drop-shadow-sm flex items-center gap-2">
          <Settings2 /> إعدادات الصوت
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border-2 border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                {isMusicMuted ? <VolumeX className="text-slate-400" /> : <Volume2 className="text-indigo-500" />}
                <span className="font-bold text-lg text-slate-700">موسيقى الخلفية</span>
              </div>
              <button 
                onClick={handleToggleMusic}
                className={`w-16 h-8 rounded-full flex items-center transition-colors px-1 ${isMusicMuted ? 'bg-slate-300 justify-start' : 'bg-indigo-500 justify-end'}`}
              >
                <div className="w-6 h-6 bg-white rounded-full shadow-sm"></div>
              </button>
            </div>
            {!isMusicMuted && (
              <div>
                <label className="text-sm font-bold text-slate-500 block mb-2">مستوى الصوت ({Math.round(volumes.music * 100)}%)</label>
                <input 
                  type="range" 
                  min="0" max="1" step="0.1" 
                  value={volumes.music} 
                  onChange={(e) => handleVolumeChange('music', parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            )}
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border-2 border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="text-pink-500" />
              <span className="font-bold text-lg text-slate-700">صوت الشخصيات</span>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-500 block mb-2">مستوى الصوت ({Math.round(volumes.voice * 100)}%)</label>
              <input 
                type="range" 
                min="0" max="1" step="0.1" 
                value={volumes.voice} 
                onChange={(e) => handleVolumeChange('voice', parseFloat(e.target.value))}
                className="w-full accent-pink-500"
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border-2 border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="text-amber-500" />
              <span className="font-bold text-lg text-slate-700">المؤثرات الصوتية</span>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-500 block mb-2">مستوى الصوت ({Math.round(volumes.effects * 100)}%)</label>
              <input 
                type="range" 
                min="0" max="1" step="0.1" 
                value={volumes.effects} 
                onChange={(e) => handleVolumeChange('effects', parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border-2 border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="text-green-500" />
              <span className="font-bold text-lg text-slate-700">صوت القرآن الكريم</span>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-500 block mb-2">مستوى الصوت ({Math.round(volumes.quran * 100)}%)</label>
              <input 
                type="range" 
                min="0" max="1" step="0.1" 
                value={volumes.quran} 
                onChange={(e) => handleVolumeChange('quran', parseFloat(e.target.value))}
                className="w-full accent-green-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Account & Persistence Section */}
      <div className="mt-8 bg-indigo-50 p-6 rounded-3xl border-4 border-indigo-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Cloud size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-indigo-900">سحابة Firebase وحفظ البيانات</h3>
                {isCloudSynced && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                    مزامنة نشطة ☁️
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-indigo-700 mt-0.5">
                {user ? (
                  <>مسجل باسم: <b className="font-mono">{user.email}</b> ({isAdmin ? 'مدير النظام 👑' : 'ولي أمر 👨‍👩‍👧'})</>
                ) : (
                  'سجّل الدخول لحفظ كافة أسماء الأطفال وتقدمهم ومكافآتهم في قاعدة البيانات السحابية.'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            {user ? (
              <>
                <button
                  onClick={async () => {
                    setSyncing(true);
                    await syncAllToCloud();
                    setTimeout(() => setSyncing(false), 500);
                  }}
                  disabled={syncing}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition disabled:opacity-60"
                >
                  <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
                  <span>مزامنة الآن</span>
                </button>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-rose-600 font-bold text-sm border border-rose-200 transition"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <button
                onClick={openAuthModal}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-indigo-600 to-purple-600 hover:from-indigo-700 text-white font-black text-sm shadow-lg shadow-indigo-200 transition"
              >
                <KeyRound size={18} />
                <span>تسجيل الدخول / إنشاء حساب</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {player.id === globalState.activeProfileId && (
        <div className="mt-8 bg-rose-50 p-6 rounded-3xl border-4 border-rose-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 className="text-xl font-black text-rose-700 mb-1">إعادة تعيين التقدم</h3>
            <p className="text-rose-600 font-bold">سيؤدي هذا إلى مسح جميع بيانات {player.name} والبدء من جديد.</p>
          </div>
          <BigButton 
            color={confirmReset ? 'primary' : 'warning'}
            onClick={handleReset}
            className="whitespace-nowrap"
          >
            {confirmReset ? 'تأكيد الحذف؟' : 'مسح البيانات'}
          </BigButton>
        </div>
      )}

      <div className="mt-8 text-center text-slate-500 bg-slate-100 p-6 rounded-3xl text-sm border-2 border-slate-200 shadow-inner">
        <p className="font-bold">هذه المنطقة محمية للآباء فقط. كافة البيانات محفوظة ومشفرة في قاعدة بيانات Firebase Firestore ومزامنة مع حسابك.</p>
      </div>
    </div>
  );
};
