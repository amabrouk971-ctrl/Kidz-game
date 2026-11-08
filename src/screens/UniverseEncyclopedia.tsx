import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, BookOpen, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { useGame } from '../store/GameContext';
import { UNIVERSE_CATEGORIES, UniverseCategory, UNIVERSE_OBJECTS } from '../data/universe';

interface Props {
  onBack: () => void;
  onSelectCategory: (categoryId: UniverseCategory) => void;
}

export const UniverseEncyclopedia: React.FC<Props> = ({ onBack, onSelectCategory }) => {
  const { activePlayer } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<UniverseCategory | null>(null);

  if (!activePlayer) return null;

  const getProgress = (categoryId: string) => {
    const total = UNIVERSE_OBJECTS.filter(o => o.categoryId === categoryId).length;
    if (total === 0) return { discovered: 0, total: 0, percent: 0 };
    
    // Count how many items in this category are in discoveredUniverseItems
    const discoveredList = activePlayer.discoveredUniverseItems || [];
    const discovered = UNIVERSE_OBJECTS.filter(o => o.categoryId === categoryId && discoveredList.includes(o.id)).length;
    
    return {
      discovered,
      total,
      percent: Math.min(100, Math.round((discovered / total) * 100))
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 safe-pt safe-px rtl relative" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 100%)' }}>
      <div className="max-w-6xl mx-auto pt-8 pb-32">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white p-6 rounded-[40px] shadow-sm border-4 border-sky-100 gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={onBack} className="bg-sky-100 p-4 rounded-full text-sky-600 hover:bg-sky-200 transition-colors shrink-0">
              <ArrowRight size={32} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-5xl font-black text-sky-700 flex items-center gap-3">
                <BookOpen size={40} className="text-sky-500 hidden md:block" /> موسوعة تيا
              </h1>
              <p className="text-sky-600/80 font-bold text-lg">يلا نكتشف حاجات جديدة كل يوم!</p>
            </div>
          </div>
          
          <div className="bg-amber-100 px-6 py-4 rounded-full border-4 border-amber-300 font-bold text-amber-700 text-xl flex items-center gap-3 shadow-sm w-full md:w-auto justify-center">
            <Star fill="#f59e0b" className="text-amber-500" size={28} /> 
            إجمالي الاكتشافات: {activePlayer.discoveredUniverseItems?.length || 0}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {UNIVERSE_CATEGORIES.map(category => {
            const prog = getProgress(category.id);
            const isComplete = prog.percent === 100;
            
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectCategory(category.id)}
                className={`relative flex flex-col p-6 rounded-[32px] border-4 shadow-sm text-right transition-all overflow-hidden bg-gradient-to-br ${category.bgGradient} border-white`}
              >
                <div className="absolute -top-4 -left-4 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="bg-white/90 w-20 h-20 rounded-2xl flex items-center justify-center text-5xl shadow-inner border-2 border-white/50">
                    {category.icon}
                  </div>
                  {isComplete && (
                    <div className="bg-white text-emerald-500 p-2 rounded-full shadow-md">
                      <CheckCircle2 size={24} />
                    </div>
                  )}
                </div>
                
                <h3 className="text-3xl font-black text-white mb-2 relative z-10 drop-shadow-md">
                  {category.title}
                </h3>
                
                <div className="mt-auto pt-4 relative z-10">
                  <div className="flex justify-between text-white/90 text-sm font-bold mb-2 drop-shadow-sm">
                    <span>{prog.percent}%</span>
                    <span>{prog.discovered} من {prog.total}</span>
                  </div>
                  <div className="w-full h-4 bg-black/10 rounded-full overflow-hidden border border-white/20 shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${isComplete ? 'bg-emerald-400' : 'bg-white'}`}
                      style={{ width: `${prog.percent}%` }}
                    />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
