import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Backpack, Heart, Sparkles, Star, Gem } from 'lucide-react';
import { useGame } from '../store/GameContext';
import { REWARDS } from '../data/rewards';
import { ItemCategory } from '../types';

interface Props {
  onBack: () => void;
}

const CATEGORIES: { id: ItemCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'الكل', icon: '✨' },
  { id: 'rewards', label: 'جوائز', icon: '🎁' },
  { id: 'toys', label: 'ألعاب', icon: '🧸' },
  { id: 'clothes', label: 'ملابس', icon: '👗' },
  { id: 'friends', label: 'أصحاب', icon: '🐾' },
  { id: 'decor', label: 'زينة', icon: '🌸' },
  { id: 'flight', label: 'طيران', icon: '✈️' },
  { id: 'swimming', label: 'سباحة', icon: '🏊' },
  { id: 'education', label: 'تعليم', icon: '📚' }
];

export const InventoryScreen: React.FC<Props> = ({ onBack }) => {
  const { state } = useGame();
  const [activeCategory, setActiveCategory] = useState<ItemCategory | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const inventory = state.player.inventory || { items: {}, unopenedGifts: 0, placedItems: { room: [], aquarium: [] } };
  
  // Get all items the player has
  const playerItems = Object.entries(inventory.items).map(([id, count]) => {
    const itemData = REWARDS.find(r => r.id === id);
    return { ...itemData, count };
  }).filter(item => item.id !== undefined) as (typeof REWARDS[0] & { count: number })[];

  const filteredItems = REWARDS.filter(item => activeCategory === 'all' || item.category === activeCategory).map(item => {
    const count = inventory.items[item.id] || 0;
    return { ...item, count };
  });

  return (
    <div className="min-h-screen bg-pink-50 p-4 safe-pt safe-px rtl relative">
      <div className="max-w-6xl mx-auto pt-8">
        <div className="bg-white p-6 rounded-[30px] shadow-sm border-2 border-pink-100 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="bg-pink-100 p-4 rounded-full text-pink-600 hover:bg-pink-200 transition-colors">
              <ArrowRight size={32} />
            </button>
            <h1 className="text-3xl md:text-4xl font-black text-pink-600 flex items-center gap-3">
              <Backpack size={40} className="text-pink-500" /> شنطة {state.player.name}
            </h1>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <div className="bg-amber-100 px-6 py-3 rounded-full border-2 border-amber-300 font-bold text-amber-700 text-xl flex items-center gap-2 shadow-sm hover:scale-105 transition-transform">
              <Star fill="#f59e0b" className="text-amber-500" size={24} /> {state.player.stars}
            </div>
            <div className="bg-blue-100 px-6 py-3 rounded-full border-2 border-blue-300 font-bold text-blue-700 text-xl flex items-center gap-2 shadow-sm hover:scale-105 transition-transform">
              <Gem fill="#3b82f6" className="text-blue-500" size={24} /> {state.player.gems}
            </div>
            <div className="bg-pink-100 px-6 py-3 rounded-full border-2 border-pink-300 font-bold text-pink-700 text-xl flex items-center gap-2 shadow-sm hover:scale-105 transition-transform">
              <Sparkles size={24} className="text-pink-500" /> {Object.keys(inventory.items).length} أنواع
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar */}
          <div className="lg:w-1/4 flex flex-row lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-4 transition-all whitespace-nowrap min-w-max lg:min-w-0 ${
                  activeCategory === cat.id 
                    ? 'bg-pink-500 border-pink-400 text-white shadow-lg scale-105' 
                    : 'bg-white border-pink-100 text-gray-600 hover:bg-pink-50'
                }`}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xl font-bold">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-[40px] p-8 border-4 border-pink-200 shadow-xl min-h-[60vh]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {filteredItems.map(item => {
                  const isCollected = item.count > 0;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={isCollected ? { scale: 1.05 } : {}}
                      whileTap={isCollected ? { scale: 0.95 } : {}}
                      onClick={() => isCollected && setSelectedItem(item.id)}
                      className={`relative bg-gray-50 rounded-3xl p-6 border-4 flex flex-col items-center justify-center gap-4 transition-colors ${
                        isCollected
                          ? item.rarity === 'legendary' ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]' :
                            item.rarity === 'epic' ? 'border-purple-300' :
                            item.rarity === 'rare' ? 'border-blue-300' : 'border-gray-200'
                          : 'border-gray-200 opacity-50 grayscale'
                      }`}
                    >
                      <span className={`text-6xl ${!isCollected && 'brightness-0 opacity-20'}`}>
                        {item.icon}
                      </span>
                      <span className={`font-bold text-lg ${isCollected ? 'text-gray-700' : 'text-gray-400'}`}>
                        {isCollected ? item.name : '؟؟؟'}
                      </span>
                      
                      {item.count > 1 && (
                        <div className="absolute -top-3 -right-3 bg-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-xl border-4 border-white shadow-md">
                          x{item.count}
                        </div>
                      )}
                      
                      {!isCollected && (
                        <div className="absolute top-2 left-2">
                          <span className="text-xs font-bold text-gray-400 bg-gray-200 px-2 py-1 rounded-full">🔒</span>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
