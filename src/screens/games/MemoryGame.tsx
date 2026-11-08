import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { GameEngine } from '../../components/game/GameEngine';

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦋', '🐢', '🐙', '🐬', '🐳', '🐟', '🍎', '🍓', '🚗', '🚀', '⭐'];

type CardState = {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export const MemoryGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const questions = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => {
      // 2 pairs for first 3 levels, 3 pairs for next 4 levels, 4 pairs for last 3 levels
      const pairsCount = i < 3 ? 2 : i < 7 ? 3 : 4;
      
      const shuffledEmojis = [...emojis].sort(() => Math.random() - 0.5);
      const selectedEmojis = shuffledEmojis.slice(0, pairsCount);
      
      return {
        pairsCount,
        emojis: selectedEmojis
      };
    });
  }, []);

  const [cards, setCards] = useState<CardState[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(-1);

  const renderQuestion = (index: number, onCorrect: () => void, onIncorrect: () => void) => {
    const q = questions[index];

    // Initialize board
    if (currentQIndex !== index) {
      setCurrentQIndex(index);
      
      const newCards = [...q.emojis, ...q.emojis]
        .sort(() => Math.random() - 0.5)
        .map((item, idx) => ({ id: idx, content: item, isFlipped: false, isMatched: false }));
        
      setCards(newCards);
      setFlippedIndices([]);
    }

    const handleCardClick = (idx: number) => {
      if (flippedIndices.length === 2 || cards[idx].isFlipped || cards[idx].isMatched) return;

      const newCards = [...cards];
      newCards[idx].isFlipped = true;
      setCards(newCards);
      
      const newFlipped = [...flippedIndices, idx];
      setFlippedIndices(newFlipped);

      if (newFlipped.length === 2) {
        const [first, second] = newFlipped;
        if (newCards[first].content === newCards[second].content) {
          // Match
          setTimeout(() => {
            newCards[first].isMatched = true;
            newCards[second].isMatched = true;
            setCards([...newCards]);
            setFlippedIndices([]);
            
            if (newCards.every(c => c.isMatched)) {
              setTimeout(onCorrect, 1000);
            }
          }, 500);
        } else {
          // No match
          setTimeout(() => {
            newCards[first].isFlipped = false;
            newCards[second].isFlipped = false;
            setCards([...newCards]);
            setFlippedIndices([]);
            // don't call onIncorrect on every miss, or maybe do?
            // "Try again" doesn't hurt. We won't call onIncorrect for just a flip mismatch, it can be frustrating.
            // Wait, the progress bar won't advance if we don't call onCorrect.
          }, 1000);
        }
      }
    };

    // Responsive grid columns based on number of cards
    const gridCols = q.pairsCount === 2 ? 'grid-cols-2' : q.pairsCount === 3 ? 'grid-cols-3' : 'grid-cols-4';

    return (
      <div className="flex flex-col items-center w-full">
        <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-md bg-teal-800/40 px-8 py-3 rounded-full mb-8">
          طابقي الصور زي بعض!
        </h2>
        
        <div className={`grid ${gridCols} gap-4 md:gap-6 bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-[40px] shadow-2xl border-8 border-white w-full max-w-2xl justify-center mx-auto`}>
          {cards.map((card, idx) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(idx)}
              className="aspect-square cursor-pointer"
              style={{ perspective: 1000 }}
            >
              <motion.div
                animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                transition={{ duration: 0.4, type: 'spring' }}
                className="w-full h-full relative"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front of card (hidden) */}
                <div 
                  className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_center,_#2DD4BF_0%,_#0D9488_100%)] rounded-2xl md:rounded-3xl border-4 border-white shadow-lg flex items-center justify-center text-white text-4xl md:text-5xl"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  ❓
                </div>
                {/* Back of card (revealed) */}
                <div 
                  className="absolute inset-0 w-full h-full bg-white rounded-2xl md:rounded-3xl border-4 border-teal-400 shadow-lg flex items-center justify-center text-5xl md:text-7xl"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  {card.content}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <GameEngine 
      gameId="memory"
      gameTitle="جزيرة الذاكرة"
      themeColor="from-teal-400 to-teal-600"
      onBack={onBack}
      renderQuestion={renderQuestion}
    />
  );
};
