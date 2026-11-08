import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check, Award } from 'lucide-react';
import { CHARACTERS } from '../../data/characters';
import { CharacterDef } from '../../types';
import { playSound } from '../../utils/audio';

interface Props {
  isOpen: boolean;
  selectedId?: string;
  onSelect: (character: CharacterDef) => void;
  onClose: () => void;
  title?: string;
}

export const CharacterPickerModal: React.FC<Props> = ({
  isOpen,
  selectedId,
  onSelect,
  onClose,
  title = 'اختر شخصيتك المفضلة للمغامرة 🌟',
}) => {
  const [filterGender, setFilterGender] = useState<'all' | 'boy' | 'girl'>('all');
  const [hoveredChar, setHoveredChar] = useState<CharacterDef | null>(null);

  if (!isOpen) return null;

  const filtered = CHARACTERS.filter((char) => {
    if (filterGender === 'all') return true;
    return char.gender === filterGender;
  });

  const handlePick = (char: CharacterDef) => {
    playSound('reward');
    onSelect(char);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-[36px] shadow-2xl border-4 border-indigo-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-gradient-to-l from-indigo-600 to-purple-600 text-white p-6 flex justify-between items-center relative">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="text-amber-300" size={24} />
                <h2 className="text-2xl md:text-3xl font-black">{title}</h2>
              </div>
              <p className="text-indigo-100 text-sm mt-1 font-medium">
                كل شخصية ليها قوة وأسلوب خاص.. مين هيكون بطلك في اللعبة؟
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Gender Filter Tabs */}
          <div className="px-6 pt-4 pb-2 flex gap-2 border-b border-slate-100 bg-slate-50">
            <button
              onClick={() => setFilterGender('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-black transition ${
                filterGender === 'all'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              الكل ({CHARACTERS.length})
            </button>
            <button
              onClick={() => setFilterGender('boy')}
              className={`px-4 py-1.5 rounded-full text-sm font-black transition ${
                filterGender === 'boy'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              أبطال أولاد 👦
            </button>
            <button
              onClick={() => setFilterGender('girl')}
              className={`px-4 py-1.5 rounded-full text-sm font-black transition ${
                filterGender === 'girl'
                  ? 'bg-pink-600 text-white shadow'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              بطلات فتيات 👧
            </button>
          </div>

          {/* Character Grid */}
          <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 flex-1">
            {filtered.map((char) => {
              const isSelected = char.id === selectedId;
              return (
                <motion.div
                  key={char.id}
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  onMouseEnter={() => setHoveredChar(char)}
                  onClick={() => handlePick(char)}
                  className={`cursor-pointer rounded-3xl p-4 text-center border-4 transition-all relative flex flex-col items-center justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 shadow-lg shadow-indigo-100 ring-2 ring-indigo-400'
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow">
                      <Check size={14} strokeWidth={3} />
                    </span>
                  )}

                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-slate-100 to-indigo-50 border-2 border-slate-200 flex items-center justify-center text-4xl mb-3 shadow-inner">
                    {char.avatar}
                  </div>

                  <h3 className="font-black text-slate-800 text-base leading-snug">{char.name}</h3>
                  <span className="text-xs font-bold text-indigo-600 mt-0.5">{char.title}</span>

                  <div className="mt-2.5 w-full pt-2 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] font-bold text-slate-500">
                    <Award size={12} className="text-amber-500" />
                    <span>{char.badge}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Preview Info */}
          {hoveredChar && (
            <div className="px-6 py-3 bg-indigo-50/60 border-t border-indigo-100 flex items-center justify-between text-xs text-indigo-900 font-bold">
              <div className="flex items-center gap-2">
                <span className="text-xl">{hoveredChar.avatar}</span>
                <span>
                  {hoveredChar.name} - <b>{hoveredChar.specialty}</b>
                </span>
              </div>
              <span className="text-indigo-600 font-medium italic hidden sm:inline">
                "{hoveredChar.tagline}"
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
