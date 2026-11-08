import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Gift, Backpack, RotateCcw, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RewardItem } from '../../types';
import { audioManager } from '../../lib/audio/AudioManager';

interface Props {
  starsEarned: number;
  reward: RewardItem;
  playerName: string;
  onReplay: () => void;
  onHome: () => void;
  onInventory?: () => void;
}

export const RewardCelebration: React.FC<Props> = ({ 
  starsEarned, 
  reward, 
  playerName, 
  onReplay, 
  onHome, 
  onInventory 
}) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Step 0: Initial
    // Step 1: Characters & Stars appear
    // Step 2: Chest appears & shakes
    // Step 3: Chest opens, reward reveals
    // Step 4: Reward flies away, bag glows
    // Step 5: Final buttons
    
    audioManager.playEffect('reward');
    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch {
      // ignore
    }

    const sequence = [
      setTimeout(() => setStep(1), 1000), // Show characters & stars
      setTimeout(() => setStep(2), 3500), // Show chest
      setTimeout(() => {
        setStep(3); // Open chest
        audioManager.playEffect('success');
        try {
          confetti({ particleCount: 90, spread: 100, origin: { y: 0.5 } });
        } catch {
          // ignore
        }
      }, 5500),
      setTimeout(() => {
        setStep(4); // Reward flies
        audioManager.playEffect('click');
      }, 8500),
      setTimeout(() => setStep(5), 10000) // Show buttons
    ];

    return () => sequence.forEach(clearTimeout);
  }, []);

  const renderRarityGlow = () => {
    switch(reward.rarity) {
      case 'legendary': return 'shadow-[0_0_80px_rgba(251,191,36,1)] border-amber-400';
      case 'epic': return 'shadow-[0_0_60px_rgba(192,132,252,0.8)] border-purple-400';
      case 'rare': return 'shadow-[0_0_40px_rgba(96,165,250,0.6)] border-blue-400';
      default: return 'shadow-[0_0_20px_rgba(255,255,255,0.5)] border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md rtl overflow-hidden">
      
      {/* Background Magic Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full opacity-60"
            style={{
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step >= 1 && step < 5 && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-10 flex flex-col items-center"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg mb-4" style={{ textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
              برافو يا {playerName}!
            </h2>
            <div className="flex items-center gap-4 bg-amber-500/80 backdrop-blur-sm px-8 py-3 rounded-full border-4 border-amber-300 shadow-xl">
              <span className="text-3xl font-black text-white">+{starsEarned}</span>
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Star fill="#FCD34D" className="text-amber-200" size={40} />
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div 
            key="celebrate-step"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center justify-center gap-4 mt-20 text-center bg-white/15 backdrop-blur-md p-8 rounded-3xl border-4 border-white/30 max-w-md mx-4"
          >
            <div className="text-7xl animate-bounce">🎉</div>
            <h3 className="text-3xl md:text-4xl font-black text-white drop-shadow">إنت بطل ومميز جداً!</h3>
            <p className="text-2xl font-bold text-amber-300">عندك صندوق هدايا سحري!</p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="chest"
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              rotate: [-2, 2, -2, 2, 0] 
            }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ 
              rotate: { duration: 0.5, repeat: Infinity, repeatDelay: 1 } 
            }}
            className="flex flex-col items-center mt-20"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} 
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl"
              />
              <Gift size={160} className="text-pink-500 drop-shadow-[0_0_30px_rgba(236,72,153,0.8)] fill-pink-300 relative z-10" />
            </div>
            <h3 className="text-3xl font-black text-white mt-8 drop-shadow-md">صندوق مفاجآت!</h3>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ scale: 0.5, opacity: 0, y: -200 }}
            transition={{ type: "spring", damping: 12 }}
            className={`flex flex-col items-center bg-white/95 backdrop-blur-sm p-10 md:p-14 rounded-[40px] border-8 mt-20 ${renderRarityGlow()}`}
          >
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-40"></div>
            </motion.div>
            
            <motion.span 
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", damping: 8, delay: 0.2 }}
              className="text-9xl mb-6 block relative z-10"
            >
              {reward.icon}
            </motion.span>
            
            <h2 className="text-4xl font-black text-slate-800 mb-2 relative z-10">{reward.name}</h2>
            <div className="flex items-center justify-center gap-2 text-amber-500 font-bold text-xl bg-amber-100 px-6 py-2 rounded-full border-2 border-amber-200 relative z-10">
              <Star fill="#f59e0b" size={24} /> 
               {reward.rarity === 'legendary' ? 'نادرة جداً!' :
                reward.rarity === 'epic' ? 'مميزة!' :
                reward.rarity === 'rare' ? 'نادرة!' : 'هدية جديدة!'}
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="final"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-md p-8 md:p-12 rounded-[40px] shadow-2xl border-4 border-white text-center max-w-lg w-full mt-4"
          >
            <h2 className="text-4xl font-black text-slate-800 mb-2">🎉 عظيم!</h2>
            <p className="text-2xl text-slate-600 font-bold mb-8">عملت مجهود رائع يا {playerName}</p>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={onReplay} 
                className="bg-indigo-600 text-white px-6 py-4 rounded-full font-black text-xl shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={24} /> العب تاني
              </button>
              
              <div className="flex gap-4">
                <button 
                  onClick={onHome} 
                  className="flex-1 bg-slate-100 text-slate-700 px-6 py-4 rounded-full font-bold text-lg shadow-sm border-2 border-slate-200 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Home size={24} /> الرئيسية
                </button>
                {onInventory && (
                  <button 
                    onClick={onInventory} 
                    className="flex-1 bg-pink-100 text-pink-700 px-6 py-4 rounded-full font-bold text-lg shadow-sm border-2 border-pink-200 hover:bg-pink-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Backpack size={24} /> الشنطة
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bag Icon Notification animation */}
      <AnimatePresence>
        {step >= 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="fixed bottom-8 left-8 z-50 flex items-center gap-3 bg-white p-4 rounded-full shadow-2xl border-4 border-pink-300"
          >
            <div className="relative">
              <Backpack size={40} className="text-pink-500" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", bounce: 0.6 }}
                className="absolute -top-2 -right-2 bg-amber-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-black border-2 border-white"
              >
                +1
              </motion.div>
            </div>
            <div className="flex flex-col pr-2">
              <span className="font-bold text-slate-800 leading-tight">اتضافت</span>
              <span className="font-black text-pink-600 leading-tight">لشنطتك!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
