import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { GameEngine } from '../../components/game/GameEngine';
import { audioManager } from '../../lib/audio/AudioManager';

const allLetters = [
  { char: 'أ', word: 'أسد', icon: '🦁', color: 'bg-red-100 text-red-700' },
  { char: 'ب', word: 'بطة', icon: '🦆', color: 'bg-yellow-100 text-yellow-700' },
  { char: 'ت', word: 'تمساح', icon: '🐊', color: 'bg-green-100 text-green-700' },
  { char: 'ث', word: 'ثعلب', icon: '🦊', color: 'bg-orange-100 text-orange-700' },
  { char: 'ج', word: 'جمل', icon: '🐪', color: 'bg-amber-100 text-amber-700' },
  { char: 'ح', word: 'حصان', icon: '🐴', color: 'bg-stone-100 text-stone-700' },
  { char: 'خ', word: 'خروف', icon: '🐑', color: 'bg-zinc-100 text-zinc-700' },
  { char: 'د', word: 'ديك', icon: '🐓', color: 'bg-rose-100 text-rose-700' },
  { char: 'ذ', word: 'ذئب', icon: '🐺', color: 'bg-slate-100 text-slate-700' },
  { char: 'ر', word: 'رمان', icon: '🍎', color: 'bg-red-100 text-red-700' },
];

export const LettersGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const questions = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => {
      const target = allLetters[i % allLetters.length];
      
      const others = allLetters.filter(l => l.char !== target.char)
                               .sort(() => Math.random() - 0.5)
                               .slice(0, 2);
                               
      const options = [target, ...others].sort(() => Math.random() - 0.5);
      
      return { target, options, type: i % 2 === 0 ? 'learn' : 'find' };
    });
  }, []);

  const renderQuestion = (index: number, onCorrect: () => void, onIncorrect: () => void) => {
    const q = questions[index];

    if (q.type === 'learn') {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-[40px] shadow-2xl border-8 border-white text-center w-full max-w-2xl">
            <h2 className="text-3xl font-black text-orange-900 mb-6">حرف الـ {q.target.char}</h2>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Play character audio here ideally, but for now just move on correctly
                audioManager.playEffect('click');
                setTimeout(onCorrect, 500);
              }}
              className={`w-64 h-64 md:w-80 md:h-80 mx-auto rounded-[40px] border-[6px] border-white shadow-xl flex flex-col items-center justify-center cursor-pointer transition-all ${q.target.color}`}
            >
              <span className="text-9xl font-black">{q.target.char}</span>
              <span className="text-4xl mt-4">{q.target.icon} {q.target.word}</span>
            </motion.button>
            <p className="mt-6 text-xl font-bold text-orange-700 bg-orange-100 px-6 py-3 rounded-full inline-block border-2 border-orange-200">
              دوسي على الحرف!
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-[40px] shadow-2xl border-8 border-white text-center w-full max-w-3xl">
        <h2 className="text-3xl md:text-5xl font-black text-orange-900 mb-10 leading-tight">
          فين حرف <span className="text-6xl text-orange-600 bg-orange-100 px-4 py-2 rounded-2xl mx-2 border-4 border-orange-200">{q.target.char}</span>؟
        </h2>
        
        <div className="flex flex-wrap justify-center gap-6">
          {q.options.map(opt => (
            <motion.button
              key={opt.char}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (opt.char === q.target.char) onCorrect();
                else onIncorrect();
              }}
              className={`w-32 h-32 md:w-40 md:h-40 rounded-[32px] border-[6px] border-white shadow-xl flex items-center justify-center text-6xl md:text-7xl font-black ${opt.color} active:scale-95 transition-all`}
            >
              {opt.char}
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <GameEngine 
      gameId="letters"
      gameTitle="كهف الحروف"
      themeColor="from-orange-400 to-orange-600"
      onBack={onBack}
      renderQuestion={renderQuestion}
    />
  );
};
