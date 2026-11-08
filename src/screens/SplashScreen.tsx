import React, { useState } from 'react';
import { motion } from 'motion/react';
import { audioManager } from '../lib/audio/AudioManager';
import { Play } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onComplete }) => {
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    setStarted(true);
    audioManager.init();
    audioManager.playEffect('success');
    
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-blue-900 flex flex-col items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djIwaC0ydi0yMEgzNHYtMmgwdjJoLTJWMTZoMnYxNmgyVjE2aDJ2MTZoMlYzNGgtMnYyMGgtMnYtMjBIMzZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="z-10 text-center flex flex-col items-center"
      >
        <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] mb-4 tracking-wider">
          SMARTTECH GAMES
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold text-amber-400 drop-shadow-md bg-black/20 px-8 py-3 rounded-full inline-block border-2 border-amber-400/50">
          ألعاب سمارت تك
        </h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-8 text-2xl md:text-3xl text-blue-100 font-medium"
        >
          العِب • اتعلّم • اكتشف
        </motion.p>

        {!started ? (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="mt-12 bg-amber-400 text-blue-900 px-10 py-5 rounded-full font-black text-3xl shadow-xl flex items-center gap-4 hover:bg-amber-300 transition-colors border-4 border-white"
          >
            يلا نبدأ! <Play fill="currentColor" size={32} />
          </motion.button>
        ) : (
          <div className="mt-12 flex gap-2 h-16 items-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [-10, 0, -10],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-4 h-4 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
