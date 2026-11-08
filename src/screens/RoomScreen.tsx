import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Home, LayoutGrid } from 'lucide-react';
import { useGame } from '../store/GameContext';
import { REWARDS } from '../data/rewards';
import { RewardItem } from '../types';

interface Props {
  onBack: () => void;
}

export const RoomScreen: React.FC<Props> = ({ onBack }) => {
  const { state } = useGame();
  const [showInventory, setShowInventory] = useState(false);

  // In a real implementation, we'd use drag and drop and save positions.
  // For now, we just display the placed items in a simple grid.
  const inventory = state.player.inventory || { items: {}, unopenedGifts: 0, placedItems: { room: [], aquarium: [] } };
  
  // Just show some random items from inventory in the room to simulate placement for now
  const roomItems = Object.keys(inventory.items).filter(id => {
    const item = REWARDS.find(r => r.id === id);
    return item && (item.category === 'decor' || item.category === 'toys' || item.category === 'friends');
  }).map(id => REWARDS.find(r => r.id === id) as RewardItem);

  return (
    <div className="min-h-screen bg-indigo-50 rtl relative overflow-hidden safe-pt safe-px">
      {/* Background Room */}
      <div className="absolute inset-0 z-0">
        <div className="h-2/3 bg-indigo-100 border-b-8 border-indigo-200"></div>
        <div className="h-1/3 bg-[#d0a78b] relative" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.05) 40px, rgba(0,0,0,0.05) 42px)' }}>
          {/* Rug */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-pink-300 rounded-full opacity-80 shadow-lg"></div>
        </div>
      </div>

      <div className="relative z-10 pt-8 px-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto w-full bg-white/80 backdrop-blur-sm p-4 rounded-[30px] shadow-sm border-2 border-indigo-100">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="bg-indigo-100 p-4 rounded-full text-indigo-600 hover:bg-indigo-200 transition-colors">
              <ArrowRight size={32} />
            </button>
            <h1 className="text-3xl md:text-4xl font-black text-indigo-600 flex items-center gap-3">
              <Home size={40} className="text-indigo-500" /> أوضتي
            </h1>
          </div>
          <button 
            onClick={() => setShowInventory(!showInventory)}
            className="bg-pink-100 px-6 py-3 rounded-full border-2 border-pink-300 font-bold text-pink-700 text-xl flex items-center gap-2 hover:bg-pink-200 transition-colors"
          >
            <LayoutGrid size={24} className="text-pink-500" /> تزيين الأوضة
          </button>
        </div>

        {/* Room Area */}
        <div className="flex-grow relative max-w-6xl mx-auto w-full mb-8">
          {roomItems.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-400 opacity-60">
              <Home size={100} className="mb-4" />
              <p className="text-3xl font-black text-center">الأوضة فاضية!</p>
              <p className="text-xl font-bold text-center mt-2">افتحي شنطتك وحطي الألعاب والزينة هنا</p>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-wrap content-end justify-center gap-8 pb-12 px-8">
              {roomItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, type: "spring", bounce: 0.5 }}
                  className="text-8xl drop-shadow-xl hover:scale-110 cursor-pointer transition-transform"
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
