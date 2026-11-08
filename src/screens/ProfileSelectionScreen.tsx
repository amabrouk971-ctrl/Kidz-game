import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useGame } from '../store/GameContext';
import { Plus, Cloud, Sparkles, Wand2 } from 'lucide-react';
import { playSound } from '../utils/audio';
import { UserBadge } from '../components/auth/UserBadge';
import { CharacterPickerModal } from '../components/character/CharacterPickerModal';
import { CharacterDef } from '../types';

interface Props {
  onSelect: () => void;
  onNew: () => void;
  onOpenAdmin?: () => void;
}

export const ProfileSelectionScreen: React.FC<Props> = ({ onSelect, onNew, onOpenAdmin }) => {
  const { globalState, switchProfile, isCloudSynced, selectCharacterForPlayer } = useGame();
  const [characterPickingPlayerId, setCharacterPickingPlayerId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    switchProfile(id);
    playSound('click');
    onSelect();
  };

  const handleCharacterSelect = (char: CharacterDef) => {
    if (characterPickingPlayerId) {
      selectCharacterForPlayer(characterPickingPlayerId, char);
      setCharacterPickingPlayerId(null);
    }
  };

  const currentPlayerForPicker = globalState.profiles.find((p) => p.id === characterPickingPlayerId);

  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center p-4 safe-pt safe-pb safe-px rtl relative">
      {/* Top Header with User Badge */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          {isCloudSynced ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 shadow-sm">
              <Cloud size={14} className="text-emerald-600" />
              <span>الأسماء والشخصيات والتقدم محفوظة في السحابة</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300 shadow-sm">
              <Cloud size={14} className="text-amber-600" />
              <span>سجّل دخولك لحفظ بيانات اللاعبين سحابياً</span>
            </span>
          )}
        </div>
        <UserBadge onOpenAdmin={onOpenAdmin} />
      </div>

      <div className="text-center mb-10 mt-16">
        <h1 className="text-4xl sm:text-5xl font-black text-indigo-950 drop-shadow-sm">مين هيلعب معنا اليوم؟</h1>
        <p className="text-indigo-600 font-bold mt-2 text-sm sm:text-base">
          اختار ملفك أو اضغط لاختيار وتغيير شخصيتك المفضلة 🌟
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 max-w-5xl w-full">
        {globalState.profiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-white rounded-[36px] p-6 shadow-xl border-4 border-indigo-200 flex flex-col items-center gap-3 hover:border-indigo-500 hover:shadow-indigo-200/50 transition-all w-64 text-center relative group"
          >
            {/* Quick Character Picker Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCharacterPickingPlayerId(profile.id);
              }}
              className="absolute top-3 left-3 w-8 h-8 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition border border-indigo-200"
              title="تغيير واختيار شخصية"
            >
              <Wand2 size={16} />
            </button>

            {/* Avatar & Card Click */}
            <div
              onClick={() => handleSelect(profile.id)}
              className="cursor-pointer flex flex-col items-center w-full"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-50 to-purple-50 border-2 border-indigo-200 flex items-center justify-center text-6xl shadow-inner mb-2"
              >
                {profile.avatar}
              </motion.div>

              <span className="text-2xl font-black text-indigo-900 leading-tight">{profile.name}</span>

              {profile.characterTitle && (
                <span className="text-xs font-bold text-indigo-600 mt-0.5 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {profile.characterTitle}
                </span>
              )}

              <div className="flex items-center gap-2 mt-3">
                <span className="text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 font-bold text-xs flex items-center gap-1">
                  ⭐ {profile.stars} نجمة
                </span>
                <span className="text-cyan-700 bg-cyan-100 px-3 py-1 rounded-full border border-cyan-300 font-bold text-xs flex items-center gap-1">
                  💎 {profile.gems}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full pt-3 mt-1 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => handleSelect(profile.id)}
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow"
              >
                دخول اللعبة
              </button>
              <button
                onClick={() => setCharacterPickingPlayerId(profile.id)}
                className="px-2.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition border border-purple-200"
                title="تغيير الشخصية"
              >
                شخصية 🎭
              </button>
            </div>
          </div>
        ))}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            playSound('click');
            onNew();
          }}
          className="bg-indigo-100/70 rounded-[36px] p-6 shadow-md border-4 border-dashed border-indigo-300 flex flex-col items-center justify-center gap-3 hover:bg-indigo-200/80 transition-all w-64 min-h-[260px]"
        >
          <div className="bg-white p-4 rounded-full text-indigo-600 shadow-sm">
            <Plus size={40} strokeWidth={3} />
          </div>
          <span className="text-xl font-black text-indigo-700">إضافة لاعب جديد</span>
          <span className="text-xs text-indigo-500 font-medium">اسم، شخصية، ومغامرة جديدة</span>
        </motion.button>
      </div>

      {/* Character Picker Modal */}
      <CharacterPickerModal
        isOpen={!!characterPickingPlayerId}
        selectedId={currentPlayerForPicker?.characterId}
        onSelect={handleCharacterSelect}
        onClose={() => setCharacterPickingPlayerId(null)}
        title={
          currentPlayerForPicker
            ? `اختر شخصية لـ ${currentPlayerForPicker.name} 🌟`
            : 'اختر شخصيتك المفضلة 🌟'
        }
      />
    </div>
  );
};
