import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Star } from 'lucide-react';
import { useGame } from '../../store/GameContext';
import { getRandomRewards } from '../../data/rewards';
import { RewardItem } from '../../types';
import { DialogueManager } from '../../lib/voice/DialogueManager';

interface Props {
  onDone: () => void;
}

export const GiftOpeningScreen: React.FC<Props> = ({ onDone }) => {
  const { state, openGift } = useGame();
  const [step, setStep] = useState<'intro' | 'choose' | 'open' | 'result'>('intro');
  const [options, setOptions] = useState<RewardItem[]>([]);
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [introText] = useState(DialogueManager.getRandomGiftReaction());

  const handleStart = () => {
    setOptions(getRandomRewards(3));
    setStep('choose');
  };

  const handleChoose = (reward: RewardItem) => {
    setSelectedReward(reward);
    setStep('open');
    setTimeout(() => {
      openGift(reward.id);
      setStep('result');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rtl">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.2 }} className="flex flex-col items-center">
            <motion.div animate={{ rotate: [0, -10, 10, -10, 10, 0] }} transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}>
              <Gift size={120} className="text-pink-500 drop-shadow-[0_0_30px_rgba(236,72,153,0.8)] fill-pink-300" />
            </motion.div>
            <h2 className="text-5xl font-black text-white mt-8 mb-8 drop-shadow-md" style={{ textShadow: '2px 2px 0px #BE185D' }}>هدية جديدة!</h2>
            <button onClick={handleStart} className="bg-pink-500 text-white text-3xl font-bold py-4 px-12 rounded-full border-4 border-pink-300 shadow-xl hover:scale-105 active:scale-95 transition-transform">
              يلا نفتحها!
            </button>
          </motion.div>
        )}

        {step === 'choose' && (
          <motion.div key="choose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center w-full max-w-4xl px-4">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-12 drop-shadow-md" style={{ textShadow: '2px 2px 0px #BE185D' }}>اختاري هديتك!</h2>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center w-full">
              {options.map((opt, i) => (
                <motion.button 
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  onClick={() => handleChoose(opt)}
                  className="bg-white/20 p-8 rounded-3xl border-4 border-white/50 hover:bg-white/40 hover:scale-110 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  <Gift size={80} className="text-pink-400 fill-pink-200" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'open' && (
          <motion.div key="open" initial={{ scale: 0.5 }} animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, -10, 10, 0] }} transition={{ duration: 1, repeat: Infinity }} className="flex flex-col items-center">
            <Gift size={150} className="text-pink-500 fill-pink-300" />
          </motion.div>
        )}

        {step === 'result' && selectedReward && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center bg-white/95 p-6 md:p-12 mx-4 rounded-[40px] border-8 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.5)] max-w-lg text-center">
            <motion.div initial={{ rotate: -180, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", damping: 10 }}>
              <span className="text-9xl mb-6 block">{selectedReward.icon}</span>
            </motion.div>
            <h2 className="text-4xl font-black text-pink-600 mb-2">{selectedReward.name}</h2>
            <div className="flex items-center justify-center gap-2 mb-8 text-amber-500 font-bold text-xl bg-amber-100 px-6 py-2 rounded-full">
              <Star fill="#f59e0b" size={24} /> 
              {selectedReward.rarity === 'legendary' ? 'نادرة جداً' : 
               selectedReward.rarity === 'epic' ? 'مميزة' : 
               selectedReward.rarity === 'rare' ? 'نادرة' : 'عادية'}
            </div>
            <p className="text-xl text-gray-700 font-bold mb-8">اتضافت لشنطتك 🎒</p>
            <button onClick={onDone} className="bg-green-500 text-white text-2xl font-bold py-4 px-12 rounded-full border-4 border-green-400 shadow-lg hover:scale-105 active:scale-95 transition-transform w-full">
              شكراً!
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
