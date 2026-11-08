import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameEngine } from '../../components/game/GameEngine';
import { BigButton } from '../../components/ui/BigButton';

export const NumbersGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // Generate 10 questions
  const questions = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => {
      const targetCount = Math.floor(Math.random() * 5) + 2; // 2 to 6 items
      
      const options = [
        targetCount - 1 > 0 ? targetCount - 1 : targetCount + 2, 
        targetCount, 
        targetCount + 1
      ].sort(() => Math.random() - 0.5);

      return {
        targetCount,
        options,
        emoji: ['🐟', '🍎', '🚗', '⭐', '🎈'][i % 5]
      };
    });
  }, []);

  const [tappedItems, setTappedItems] = useState<number[]>([]);
  const [phase, setPhase] = useState<'counting' | 'question'>('counting');
  const [currentQIndex, setCurrentQIndex] = useState(-1);

  const renderQuestion = (index: number, onCorrect: () => void, onIncorrect: () => void) => {
    const q = questions[index];
    
    // Reset state when moving to a new question
    if (currentQIndex !== index) {
      setCurrentQIndex(index);
      setTappedItems([]);
      setPhase('counting');
    }

    const handleTap = (idx: number) => {
      if (!tappedItems.includes(idx)) {
        const newTapped = [...tappedItems, idx];
        setTappedItems(newTapped);
        if (newTapped.length === q.targetCount) {
          setTimeout(() => setPhase('question'), 500);
        }
      }
    };

    return (
      <div className="w-full flex flex-col items-center">
        <AnimatePresence mode="wait">
          {phase === 'counting' && (
            <motion.div key="counting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center w-full">
              <div className="bg-sky-400/30 backdrop-blur-sm w-full max-w-2xl min-h-[300px] rounded-[40px] border-8 border-white p-8 flex flex-wrap justify-center items-center gap-4 shadow-inner mb-8">
                {Array.from({ length: q.targetCount }).map((_, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                    onClick={() => handleTap(i)}
                    className={`text-6xl md:text-8xl cursor-pointer transition-all ${tappedItems.includes(i) ? 'opacity-30 grayscale scale-90' : 'opacity-100 hover:scale-110 drop-shadow-md'}`}
                  >
                    {q.emoji}
                  </motion.div>
                ))}
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-md bg-green-800/40 px-8 py-3 rounded-full">
                دوسي عليهم عشان نعدهم!
              </h2>
            </motion.div>
          )}

          {phase === 'question' && (
            <motion.div key="question" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center w-full">
              <h2 className="text-3xl md:text-5xl font-black text-green-700 mb-12 bg-white/95 backdrop-blur-sm px-10 py-5 rounded-full shadow-xl border-4 border-white text-center">
                دول كام {q.emoji}؟
              </h2>
              <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                {q.options.map(opt => (
                  <BigButton 
                    key={opt} 
                    color="primary" 
                    onClick={() => {
                      if (opt === q.targetCount) onCorrect();
                      else onIncorrect();
                    }} 
                    className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 !text-5xl md:!text-6xl !rounded-full shadow-xl"
                  >
                    {opt}
                  </BigButton>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <GameEngine 
      gameId="numbers"
      gameTitle="جزيرة الأرقام"
      themeColor="from-green-400 to-green-600"
      onBack={onBack}
      renderQuestion={renderQuestion}
    />
  );
};
