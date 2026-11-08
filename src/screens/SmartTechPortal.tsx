import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useGame } from '../store/GameContext';
import { 
  Play, Map as MapIcon, Backpack, Trophy, User, 
  Settings, LogOut, Star, Award, BookOpen, Wand2, Shield
} from 'lucide-react';
import { ParentGate } from '../components/ui/ParentGate';
import { UserBadge } from '../components/auth/UserBadge';
import { CharacterPickerModal } from '../components/character/CharacterPickerModal';
import { CharacterDef } from '../types';
import { useAuth } from '../store/AuthContext';

interface Props {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export const SmartTechPortal: React.FC<Props> = ({ onNavigate, onLogout }) => {
  const { activePlayer, gameConfigs, selectCharacterForPlayer } = useGame();
  const { isAdmin } = useAuth();
  const [showParentGate, setShowParentGate] = useState(false);
  const [showCharacterPicker, setShowCharacterPicker] = useState(false);

  if (!activePlayer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center rtl">
        <h2 className="text-3xl font-black text-slate-800 mb-4">أهلاً بك في منصة سمارت تك! 🌟</h2>
        <p className="text-lg text-slate-600 mb-6">دعنا ننشئ ملفك الشخصي لتنطلق في المغامرة</p>
        <button
          onClick={() => onNavigate('onboarding')}
          className="bg-indigo-600 text-white font-black text-xl px-8 py-4 rounded-full shadow-lg hover:bg-indigo-700 transition"
        >
          إنشاء ملف بطل جديد 🚀
        </button>
      </div>
    );
  }

  // Merge default games with any configured games from Firestore/Local
  const activeGames = gameConfigs.filter((g) => g.isEnabled);

  const todayMissions = [
    { title: 'لعبة ألوان', icon: '🎨', completed: (activePlayer.progress as any).colors > 0 },
    { title: 'سؤال ديني', icon: '🕌', completed: (activePlayer.progress as any).religiousKnowledge > 0 },
    { title: 'تحدي سباحة', icon: '🏊', completed: (activePlayer.progress as any).swimming > 0 },
  ];

  const handleCharacterSelect = (char: CharacterDef) => {
    selectCharacterForPlayer(activePlayer.id, char);
    setShowCharacterPicker(false);
  };

  return (
    <div
      className="min-h-screen bg-slate-50 flex flex-col safe-pt safe-pb safe-px rtl relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)' }}
    >
      {/* Header */}
      <header className="bg-white px-4 md:px-8 py-3.5 shadow-sm border-b border-slate-200 flex flex-wrap justify-between items-center z-10 sticky top-0 gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar with quick character change trigger */}
          <button
            onClick={() => setShowCharacterPicker(true)}
            className="relative group w-12 h-12 md:w-14 md:h-14 bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-full border-3 border-indigo-300 flex items-center justify-center text-3xl shadow transition hover:scale-105"
            title="اضغط لتغيير شخصيتك المفضلة"
          >
            {activePlayer.avatar}
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] shadow">
              <Wand2 size={11} />
            </span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                أهلاً يا {activePlayer.name}!
              </h1>
              {activePlayer.characterTitle && (
                <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {activePlayer.characterTitle}
                </span>
              )}
            </div>
            <button
              onClick={() => setShowCharacterPicker(true)}
              className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>تغيير الشخصية 🎭</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow transition"
              title="لوحة تحكم المشرف الكاملة"
            >
              <Shield size={14} />
              <span>لوحة المشرف ⚙️</span>
            </button>
          )}

          <UserBadge onOpenAdmin={() => onNavigate('admin')} />

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200">
            <div className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full">
              <Star className="text-amber-500" fill="currentColor" size={18} />
              <span className="font-black text-amber-700 text-sm">{activePlayer.stars}</span>
            </div>
            <div className="flex items-center gap-1 bg-cyan-100 px-2.5 py-1 rounded-full text-xs font-bold text-cyan-800">
              <span>💎 {activePlayer.gems}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 z-0 pb-32">
        {/* Today's Mission Dashboard */}
        <section className="bg-indigo-600 rounded-[32px] p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Award /> مغامرة النهارده
              </h2>
              <span className="bg-indigo-800 px-4 py-1 rounded-full font-bold text-sm">
                {todayMissions.filter((m) => m.completed).length} من {todayMissions.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {todayMissions.map((mission, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-colors ${
                    mission.completed
                      ? 'bg-indigo-500/50 border-indigo-400 opacity-70'
                      : 'bg-white/10 border-white/20'
                  }`}
                >
                  <span className="text-3xl">{mission.icon}</span>
                  <span
                    className={`font-bold text-lg ${
                      mission.completed ? 'line-through decoration-2 opacity-80' : ''
                    }`}
                  >
                    {mission.title}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('map')}
              className="bg-white text-indigo-700 px-8 py-4 rounded-full font-black text-xl shadow-lg hover:bg-indigo-50 transition-colors flex items-center gap-2 whitespace-nowrap w-full justify-center"
            >
              كمل المغامرة <MapIcon />
            </button>
          </div>
        </section>

        {/* Universe Portal */}
        <section
          className="bg-sky-500 rounded-[32px] p-6 md:p-8 text-white shadow-xl relative overflow-hidden cursor-pointer transform hover:scale-[1.01] transition-transform"
          onClick={() => onNavigate('universe')}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-black mb-2 drop-shadow-md flex items-center gap-3">
                <BookOpen size={36} /> موسوعة تيا (جديد)
              </h2>
              <p className="text-xl font-bold text-sky-100">تعالوا نتعلم ونكتشف حاجات جديدة كل يوم!</p>
            </div>
            <div className="bg-white text-sky-600 px-8 py-4 rounded-full font-black text-2xl shadow-lg flex items-center gap-2 whitespace-nowrap">
              اكتشف الآن <Play size={24} fill="currentColor" />
            </div>
          </div>
        </section>

        {/* Game Library (Controlled by Admin Game Configs) */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-black text-slate-800">اختار لعبة</h2>
              <p className="text-sm font-bold text-slate-500 mt-0.5">
                الألعاب مفعلة وجاهزة للمغامرة
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeGames.map((game) => (
              <motion.button
                key={game.id}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate(game.id)}
                className={`flex flex-col p-6 rounded-[32px] border-4 shadow-sm text-right transition-all hover:shadow-md ${game.color}`}
              >
                <span className="text-6xl mb-4 bg-white/50 w-24 h-24 rounded-full flex items-center justify-center border-2 border-white/60 shadow-sm">
                  {game.icon}
                </span>
                <h3 className="text-2xl font-black mb-2">{game.title}</h3>
                <p className="text-lg font-medium opacity-80">{game.desc}</p>
                <div className="mt-auto pt-6 flex justify-between items-center w-full">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-white/60 px-2.5 py-1 rounded-full">
                    <Star size={14} className="fill-amber-500 text-amber-500" />
                    <span>+{game.rewardStars || 5} نجوم</span>
                  </div>
                  <span className="bg-white/70 px-4 py-2 rounded-full font-bold text-sm uppercase flex items-center gap-1">
                    العب <Play size={14} />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t-2 border-slate-200 p-4 fixed bottom-0 w-full z-20 flex justify-around items-center safe-pb shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <NavItem icon={<MapIcon />} label="المغامرة" onClick={() => onNavigate('map')} active />
        <NavItem icon={<Backpack />} label="شنطتي" onClick={() => onNavigate('inventory')} />
        <NavItem icon={<User />} label="شخصيتي" onClick={() => setShowCharacterPicker(true)} />
        <NavItem icon={<LogOut />} label="تغيير اللاعب" onClick={onLogout} />
        <NavItem icon={<Settings />} label="للأهل" onClick={() => setShowParentGate(true)} highlight />
      </nav>

      {/* Parent Gate */}
      {showParentGate && (
        <ParentGate
          onSuccess={() => {
            setShowParentGate(false);
            onNavigate('parent');
          }}
          onCancel={() => setShowParentGate(false)}
        />
      )}

      {/* Character Picker Modal */}
      <CharacterPickerModal
        isOpen={showCharacterPicker}
        selectedId={activePlayer.characterId}
        onSelect={handleCharacterSelect}
        onClose={() => setShowCharacterPicker(false)}
        title={`اختر شخصيتك يا ${activePlayer.name}! 🌟`}
      />
    </div>
  );
};

const NavItem = ({ icon, label, onClick, active = false, highlight = false }: any) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-colors ${
      highlight
        ? 'text-rose-500 hover:bg-rose-50'
        : active
        ? 'text-indigo-600 bg-indigo-50'
        : 'text-slate-500 hover:bg-slate-50'
    }`}
  >
    {React.cloneElement(icon, { size: 28, strokeWidth: active ? 2.5 : 2 })}
    <span className="text-xs font-bold">{label}</span>
  </button>
);
