import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Waves } from 'lucide-react';
import { useGame } from '../store/GameContext';
import { REWARDS } from '../data/rewards';
import { RewardItem } from '../types';

interface Props {
  onBack: () => void;
}

export const AquariumScreen: React.FC<Props> = ({ onBack }) => {
  const { state } = useGame();
  
  const inventory = state.player.inventory || { items: {}, unopenedGifts: 0, placedItems: { room: [], aquarium: [] } };
  
  // Show swimming category items that player owns
  const aquariumItems = Object.keys(inventory.items).filter(id => {
    const item = REWARDS.find(r => r.id === id);
    return item && item.category === 'swimming';
  }).map(id => REWARDS.find(r => r.id === id) as RewardItem);

  return (
    <div className="min-h-screen relative overflow-hidden rtl" style={{ background: 'linear-gradient(180deg, #38BDF8 0%, #0369A1 100%)' }}>
      {/* Water bubbles animation background */}
      <div className="absolute inset-0 z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`bubble-${i}`}
            className="absolute rounded-full bg-white/20 border border-white/30"
            style={{
              width: Math.random() * 30 + 10,
              height: Math.random() * 30 + 10,
              left: `${Math.random() * 100}%`,
              bottom: -50,
            }}
            animate={{
              y: [0, -window.innerHeight - 100],
              x: [0, Math.random() * 50 - 25, Math.random() * 50 - 25, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
        {/* Sand at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-[#FCD34D] rounded-t-[50%]" style={{ filter: 'blur(2px)' }}></div>
      </div>

      <div className="relative z-10 pt-8 px-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto w-full bg-white/80 backdrop-blur-sm p-4 rounded-[30px] shadow-sm border-2 border-cyan-100">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="bg-cyan-100 p-4 rounded-full text-cyan-700 hover:bg-cyan-200 transition-colors">
              <ArrowRight size={32} />
            </button>
            <h1 className="text-3xl md:text-4xl font-black text-cyan-800 flex items-center gap-3">
              <Waves size={40} className="text-cyan-600" /> حوضي
            </h1>
          </div>
        </div>

        {/* Aquarium Area */}
        <div className="flex-grow relative max-w-6xl mx-auto w-full mb-8">
          {aquariumItems.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-cyan-200 opacity-60">
              <Waves size={100} className="mb-4" />
              <p className="text-3xl font-black text-center">الحوض فاضي!</p>
              <p className="text-xl font-bold text-center mt-2">العبِي مدرسة السباحة واجمعي أسماك جميلة</p>
            </div>
          ) : (
            <div className="absolute inset-0">
              {aquariumItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  className="absolute text-7xl md:text-8xl drop-shadow-xl"
                  initial={{ 
                    x: Math.random() * (window.innerWidth - 100), 
                    y: Math.random() * (window.innerHeight - 300) + 100 
                  }}
                  animate={{
                    x: [
                      Math.random() * (window.innerWidth - 100), 
                      Math.random() * (window.innerWidth - 100),
                      Math.random() * (window.innerWidth - 100)
                    ],
                    y: [
                      Math.random() * (window.innerHeight - 300) + 100,
                      Math.random() * (window.innerHeight - 300) + 100,
                      Math.random() * (window.innerHeight - 300) + 100
                    ],
                  }}
                  transition={{
                    duration: Math.random() * 20 + 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  {item.icon}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
