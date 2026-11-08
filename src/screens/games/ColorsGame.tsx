import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { GameEngine } from '../../components/game/GameEngine';

const allColors = [
  { id: 'red', name: 'أحمر', hex: '#ef4444' },
  { id: 'blue', name: 'أزرق', hex: '#3b82f6' },
  { id: 'yellow', name: 'أصفر', hex: '#eab308' },
  { id: 'green', name: 'أخضر', hex: '#22c55e' },
  { id: 'pink', name: 'بمبي', hex: '#ec4899' },
  { id: 'orange', name: 'برتقالي', hex: '#f97316' },
  { id: 'purple', name: 'بنفسجي', hex: '#a855f7' },
  { id: 'black', name: 'أسود', hex: '#000000' },
  { id: 'white', name: 'أبيض', hex: '#ffffff' },
  { id: 'brown', name: 'بني', hex: '#8b4513' },
];

export const ColorsGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // Generate 10 questions
  const questions = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => {
      // Pick a random target color
      const target = allColors[Math.floor(Math.random() * allColors.length)];
      
      // Pick 2 other wrong options
      const others = allColors.filter(c => c.id !== target.id)
                             .sort(() => Math.random() - 0.5)
                             .slice(0, 2);
                             
      const options = [target, ...others].sort(() => Math.random() - 0.5);
      
      return {
        target,
        options,
        questionType: i < 5 ? 'find' : 'match', // simple variation
      };
    });
  }, []);

  const renderQuestion = (index: number, onCorrect: () => void, onIncorrect: () => void) => {
    const q = questions[index];
    
    return (
      <div className="bg-white/95 backdrop-blur-sm p-6 md:p-10 rounded-[40px] shadow-2xl border-8 border-white text-center w-full max-w-3xl">
        <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-8 md:mb-12 drop-shadow-sm leading-tight">
          فين اللون <span style={{ color: q.target.hex, textShadow: '1px 1px 0 #000' }}>{q.target.name}</span>؟
        </h2>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {q.options.map(c => (
            <motion.button
              key={c.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (c.id === q.target.id) onCorrect();
                else onIncorrect();
              }}
              className="w-28 h-28 sm:w-32 sm:h-32 md:w-48 md:h-48 rounded-[32px] shadow-xl border-[6px] border-white active:scale-95 transition-all"
              style={{ backgroundColor: c.hex, borderColor: c.id === 'white' ? '#e2e8f0' : 'rgba(255,255,255,0.8)' }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <GameEngine 
      gameId="colors"
      gameTitle="بحر الألوان"
      themeColor="from-pink-400 to-pink-600"
      onBack={onBack}
      renderQuestion={renderQuestion}
    />
  );
};
