const fs = require('fs');
let code = fs.readFileSync('src/store/GameContext.tsx', 'utf-8');

// 1. Interface
code = code.replace(/awardGameCompletion: \(gameId: string, category: keyof PlayerProgress, starsEarned: number\) => RewardItem \| null;/, `awardGameCompletion: (gameId: string, category: keyof PlayerProgress, starsEarned: number) => RewardItem | null;
  discoverUniverseItems: (itemIds: string[]) => void;`);

// 2. Implementation
const implStr = `const awardGameCompletion = (gameId: string, category: keyof PlayerProgress, starsEarned: number): RewardItem | null => {`;
code = code.replace(implStr, `const discoverUniverseItems = (itemIds: string[]) => {
    if (!activePlayer) return;
    const currentDiscovered = activePlayer.discoveredUniverseItems || [];
    const newDiscovered = Array.from(new Set([...currentDiscovered, ...itemIds]));
    updateProfile({
      discoveredUniverseItems: newDiscovered
    });
  };

  ` + implStr);

// 3. Context provider value
code = code.replace(/awardGameCompletion,/, `awardGameCompletion,\n      discoverUniverseItems,`);

fs.writeFileSync('src/store/GameContext.tsx', code);
