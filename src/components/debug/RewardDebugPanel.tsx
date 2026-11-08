import React, { useState } from 'react';
import { useGame } from '../../store/GameContext';
import { REWARDS } from '../../data/rewards';
import { Settings, X } from 'lucide-react';

export const RewardDebugPanel: React.FC = () => {
  const { activePlayer, addStars, awardGameCompletion, updateProfile } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [lastRewardId, setLastRewardId] = useState<string | null>(null);

  if (process.env.NODE_ENV === 'production') return null;
  if (!activePlayer) return null;

  const inventoryCount = Object.keys(activePlayer.inventory?.items || {}).length;

  const handleAddRareGift = () => {
    const rareRewards = REWARDS.filter(r => r.rarity === 'rare' || r.rarity === 'epic' || r.rarity === 'legendary');
    const randomRare = rareRewards[Math.floor(Math.random() * rareRewards.length)];
    
    const inventory = activePlayer.inventory || { items: {}, unopenedGifts: 0, placedItems: { room: [], aquarium: [] } };
    const currentCount = inventory.items[randomRare.id] || 0;
    
    updateProfile({
      inventory: {
        ...inventory,
        items: {
          ...inventory.items,
          [randomRare.id]: currentCount + 1
        }
      }
    });
    setLastRewardId(randomRare.id);
  };

  const handleClearInventory = () => {
    const inventory = activePlayer.inventory || { items: {}, unopenedGifts: 0, placedItems: { room: [], aquarium: [] } };
    updateProfile({
      inventory: {
        ...inventory,
        items: {}
      }
    });
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-2 left-2 z-[9999] bg-black/50 text-white p-2 rounded-full hover:bg-black"
        title="Debug Rewards"
      >
        <Settings size={16} />
      </button>
    );
  }

  return (
    <div className="fixed top-2 left-2 z-[9999] bg-black/90 text-xs text-green-400 p-4 rounded-xl border border-green-500/50 w-72 max-h-[80vh] overflow-y-auto ltr" style={{ direction: 'ltr' }}>
      <div className="flex justify-between items-center mb-4 border-b border-green-500/30 pb-2">
        <h3 className="font-bold text-white">⚙️ REWARDS DEBUG</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white"><X size={16} /></button>
      </div>
      
      <div className="space-y-2 mb-4">
        <div><span className="text-gray-400">Player:</span> {activePlayer.name}</div>
        <div><span className="text-gray-400">Stars:</span> {activePlayer.stars}</div>
        <div><span className="text-gray-400">Gems:</span> {activePlayer.gems}</div>
        <div><span className="text-gray-400">Inventory Types:</span> {inventoryCount}</div>
        {lastRewardId && <div><span className="text-gray-400">Last Reward ID:</span> {lastRewardId}</div>}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button onClick={() => addStars(1)} className="bg-blue-600/50 hover:bg-blue-600 text-white p-1 rounded">+1 Star</button>
        <button onClick={() => addStars(10)} className="bg-blue-600/50 hover:bg-blue-600 text-white p-1 rounded">+10 Stars</button>
        <button onClick={() => {
          const reward = awardGameCompletion('debug', 'generalKnowledge', 0);
          if (reward) setLastRewardId(reward.id);
        }} className="bg-purple-600/50 hover:bg-purple-600 text-white p-1 rounded">+ Test Gift</button>
        <button onClick={handleAddRareGift} className="bg-amber-600/50 hover:bg-amber-600 text-white p-1 rounded">+ Rare Gift</button>
        <button onClick={handleClearInventory} className="bg-red-600/50 hover:bg-red-600 text-white p-1 rounded col-span-2">Clear Inventory</button>
      </div>

      <div className="mt-4">
        <div className="text-gray-400 mb-1 border-b border-green-500/30 pb-1">Inventory JSON</div>
        <pre className="text-[10px] overflow-x-auto text-yellow-300">
          {JSON.stringify(activePlayer.inventory?.items, null, 2)}
        </pre>
      </div>
    </div>
  );
};
