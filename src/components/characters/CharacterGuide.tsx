import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { Emotion } from '../../lib/voice/types';
import { speak } from '../../utils/audio';
import { useGame } from '../../store/GameContext';

type CharacterType = 'player';

interface CharacterGuideProps {
  type?: CharacterType | string;
  message?: string;
  position?: 'left' | 'right' | 'center';
  emotion?: Emotion;
  autoSpeak?: boolean;
}

export const CharacterGuide: React.FC<CharacterGuideProps> = ({
  type = 'player',
  message,
  position = 'left',
  emotion = 'neutral',
  autoSpeak = true,
}) => {
  const { activePlayer } = useGame();

  useEffect(() => {
    if (message && autoSpeak) {
      speak(message, undefined, 'tia', emotion as Emotion);
    }
  }, [message, autoSpeak, emotion]);

  const getEmoji = () => {
    return activePlayer?.avatar || '⭐';
  };

  const getLabel = () => {
    return activePlayer?.name || 'صديقي';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: position === 'left' ? -50 : position === 'right' ? 50 : 0 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`fixed bottom-24 md:bottom-10 ${position === 'left' ? 'left-10' : position === 'right' ? 'right-10' : 'left-1/2 -translate-x-1/2'} z-50 flex flex-col items-center max-w-sm`}
    >
      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white p-3 rounded-2xl shadow-lg border-2 relative text-center min-w-[200px] border-indigo-400"
          >
            <button 
              onClick={() => speak(message, undefined, 'tia', emotion as Emotion)}
              className="absolute -top-3 -right-3 text-white p-2 rounded-full shadow transition bg-indigo-500 hover:bg-indigo-600"
            >
              <Volume2 size={18} />
            </button>
            <p className="text-lg font-black leading-snug text-indigo-600">{message}</p>
            {/* Speech bubble pointer */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[15px] border-t-indigo-400" />
            <div className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-white" />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        animate={
          emotion === 'celebrate' ? { y: [0, -20, 0], rotate: [0, -10, 10, 0] } :
          emotion === 'happy' ? { y: [0, -10, 0] } : 
          { y: [0, -5, 0] }
        }
        transition={{ repeat: Infinity, duration: emotion === 'celebrate' ? 0.5 : 2 }}
        className="w-32 h-32 rounded-full border-4 bg-indigo-400 border-white flex flex-col items-center justify-center text-6xl shadow-xl"
      >
        <span role="img" aria-label={getLabel()}>{getEmoji()}</span>
      </motion.div>
      <div className="text-white px-6 py-1 rounded-full mt-2 font-black shadow-md bg-indigo-600">
        {getLabel()}
      </div>
    </motion.div>
  );
};
