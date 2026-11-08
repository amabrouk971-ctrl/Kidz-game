import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { GameEngine } from '../../components/game/GameEngine';

const allShapes = [
  { id: 'circle', name: 'دايرة', svg: <circle cx="50" cy="50" r="45" fill="currentColor"/>, color: 'text-red-500' },
  { id: 'square', name: 'مربع', svg: <rect x="5" y="5" width="90" height="90" rx="10" fill="currentColor"/>, color: 'text-blue-500' },
  { id: 'triangle', name: 'مثلث', svg: <polygon points="50,5 95,95 5,95" fill="currentColor" strokeLinejoin="round" />, color: 'text-green-500' },
  { id: 'star', name: 'نجمة', svg: <polygon points="50,5 61,35 95,35 68,55 78,85 50,65 22,85 32,55 5,35 39,35" fill="currentColor" />, color: 'text-yellow-500' },
  { id: 'heart', name: 'قلب', svg: <path d="M50,90 C50,90 5,60 5,30 C5,10 25,5 40,20 C50,30 50,30 50,30 C50,30 50,30 60,20 C75,5 95,10 95,30 C95,60 50,90 50,90 Z" fill="currentColor"/>, color: 'text-pink-500' }
];

export const ShapesGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const questions = useMemo(() => {
    return Array.from({ length: 10 }).map(() => {
      const target = allShapes[Math.floor(Math.random() * allShapes.length)];
      
      const others = allShapes.filter(s => s.id !== target.id)
                              .sort(() => Math.random() - 0.5)
                              .slice(0, 2);
                              
      const options = [target, ...others].sort(() => Math.random() - 0.5);
      
      return { target, options };
    });
  }, []);

  const renderQuestion = (index: number, onCorrect: () => void, onIncorrect: () => void) => {
    const q = questions[index];

    return (
      <div className="bg-white/95 backdrop-blur-sm p-6 md:p-10 rounded-[40px] shadow-2xl border-8 border-white text-center w-full max-w-3xl">
        <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-8 md:mb-12">
          فين شكل الـ <span className={`${q.target.color} drop-shadow-sm`}>{q.target.name}</span>؟
        </h2>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {q.options.map(opt => (
            <motion.button
              key={opt.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (opt.id === q.target.id) onCorrect();
                else onIncorrect();
              }}
              className="w-32 h-32 md:w-48 md:h-48 rounded-[32px] bg-slate-50 border-[6px] border-slate-200 shadow-xl flex items-center justify-center p-4 active:scale-95 transition-all hover:bg-slate-100"
            >
              <svg viewBox="0 0 100 100" className={`w-full h-full ${opt.color} drop-shadow-md`}>
                {opt.svg}
              </svg>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <GameEngine 
      gameId="shapes"
      gameTitle="عالم الأشكال"
      themeColor="from-amber-400 to-amber-600"
      onBack={onBack}
      renderQuestion={renderQuestion}
    />
  );
};
