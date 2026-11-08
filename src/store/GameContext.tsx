import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { GlobalState, Player, PlayerProgress, RewardItem, GameConfig, CharacterDef } from '../types';
import { getRandomRewards } from '../data/rewards';
import { DEFAULT_GAME_CONFIGS } from '../data/defaultGameConfigs';
import { useAuth } from './AuthContext';
import {
  savePlayerToFirestore,
  deletePlayerFromFirestore,
  subscribeUserPlayers,
  subscribeGameConfigs,
  saveGameConfigToFirestore
} from '../lib/firebase/dbService';

export const createNewPlayer = (
  name: string,
  gender: Player['gender'],
  avatar: string,
  characterId?: string,
  characterTitle?: string
): Player => ({
  id: `player-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  name,
  gender,
  avatar,
  characterId,
  characterTitle,
  level: 1,
  stars: 0,
  gems: 0,
  badges: ['بطل سمارت تك'],
  completedLevels: [],
  progress: {
    swimming: 0,
    colors: 0,
    numbers: 0,
    letters: 0,
    shapes: 0,
    memory: 0,
    politeness: 0,
    flightAcademy: 0,
    quran: 0,
    religiousKnowledge: 0,
    professions: 0,
    generalKnowledge: 0,
  },
  inventory: {
    items: {},
    unopenedGifts: 1,
    placedItems: { room: [], aquarium: [] },
  },
  timePlayedSeconds: 0,
  createdAt: Date.now(),
  universeProgress: {},
  discoveredUniverseItems: [],
});

const defaultGlobalState: GlobalState = {
  profiles: [],
  activeProfileId: null,
  isAudioEnabled: true,
  isMusicEnabled: true,
};

type GameContextType = {
  globalState: GlobalState;
  state: { player: Player; isAudioEnabled: boolean; isMusicEnabled: boolean }; // Backwards compatibility for existing code
  activePlayer: Player | null;
  isCloudSynced: boolean;
  gameConfigs: GameConfig[];
  updateGameConfig: (config: GameConfig) => Promise<void>;
  selectCharacterForPlayer: (playerId: string, character: CharacterDef) => Promise<void>;
  addProfile: (
    name: string,
    gender: Player['gender'],
    avatar: string,
    characterId?: string,
    characterTitle?: string
  ) => Promise<Player>;
  deleteProfile: (id: string) => Promise<void>;
  switchProfile: (id: string) => void;
  updateProfile: (updates: Partial<Player>) => void;
  addStars: (amount: number) => void;
  addGems: (amount: number) => void;
  addGift: () => void;
  openGift: (itemId: string) => void;
  completeLevel: (levelId: string, category: keyof PlayerProgress) => void;
  awardGameCompletion: (gameId: string, category: keyof PlayerProgress, starsEarned: number) => RewardItem | null;
  discoverUniverseItems: (itemIds: string[]) => void;
  toggleAudio: () => void;
  toggleMusic: () => void;
  resetProgress: () => void; // Resets current profile
  syncAllToCloud: () => Promise<void>;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const isSyncingRef = useRef<boolean>(false);

  // Game Configurations state & local persistence
  const [gameConfigs, setGameConfigs] = useState<GameConfig[]>(() => {
    const saved = localStorage.getItem('smarttech-game-configs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        return DEFAULT_GAME_CONFIGS;
      }
    }
    return DEFAULT_GAME_CONFIGS;
  });

  useEffect(() => {
    localStorage.setItem('smarttech-game-configs', JSON.stringify(gameConfigs));
  }, [gameConfigs]);

  // Subscribe to real-time Game Configurations from Firestore
  useEffect(() => {
    const unsub = subscribeGameConfigs((remoteConfigs) => {
      if (remoteConfigs && remoteConfigs.length > 0) {
        setGameConfigs(remoteConfigs);
      }
    });
    return () => unsub();
  }, []);

  const updateGameConfig = async (config: GameConfig): Promise<void> => {
    // Update local state immediately for responsive UI
    setGameConfigs((prev) => {
      const idx = prev.findIndex((c) => c.id === config.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = config;
        return copy;
      }
      return [...prev, config];
    });

    try {
      await saveGameConfigToFirestore(config);
    } catch (err) {
      console.warn('Could not save game config to Firestore:', err);
    }
  };

  const [globalState, setGlobalState] = useState<GlobalState>(() => {
    const saved = localStorage.getItem('smarttech-games-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.player) {
          const oldPlayer = parsed.player as Player;
          if (!oldPlayer.gender) oldPlayer.gender = 'prefer_not_to_say';
          return {
            profiles: [oldPlayer],
            activeProfileId: oldPlayer.id,
            isAudioEnabled: parsed.isAudioEnabled ?? true,
            isMusicEnabled: parsed.isMusicEnabled ?? true,
          };
        }
        return parsed;
      } catch (e) {
        return defaultGlobalState;
      }
    }
    return defaultGlobalState;
  });

  // Keep localStorage updated as secondary backup
  useEffect(() => {
    localStorage.setItem('smarttech-games-state', JSON.stringify(globalState));
  }, [globalState]);

  // Sync with Firestore when user is authenticated
  useEffect(() => {
    if (!user) {
      setIsCloudSynced(false);
      return;
    }

    // Subscribe to player documents owned by this user
    const unsubscribe = subscribeUserPlayers(
      user.uid,
      async (remotePlayers) => {
        if (isSyncingRef.current) return;

        if (remotePlayers.length > 0) {
          setGlobalState((prev) => {
            const activeId = prev.activeProfileId && remotePlayers.some(p => p.id === prev.activeProfileId)
              ? prev.activeProfileId
              : remotePlayers[0].id;

            return {
              ...prev,
              profiles: remotePlayers,
              activeProfileId: activeId,
            };
          });
          setIsCloudSynced(true);
        } else {
          // If no players in Firestore yet, but we have local profiles, upload them to Firestore!
          if (globalState.profiles.length > 0) {
            isSyncingRef.current = true;
            try {
              for (const player of globalState.profiles) {
                await savePlayerToFirestore(player, user.uid);
              }
              setIsCloudSynced(true);
            } catch (err) {
              console.warn('Initial migration to Firestore failed:', err);
            } finally {
              isSyncingRef.current = false;
            }
          }
        }
      },
      (err) => {
        console.warn('Firestore subscription error:', err);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const activePlayer =
    globalState.profiles.find((p) => p.id === globalState.activeProfileId) ||
    globalState.profiles[0] ||
    null;

  // Track playtime
  useEffect(() => {
    if (!activePlayer) return;
    const interval = setInterval(() => {
      setGlobalState((prev) => ({
        ...prev,
        profiles: prev.profiles.map((p) =>
          p.id === prev.activeProfileId
            ? { ...p, timePlayedSeconds: (p.timePlayedSeconds || 0) + 10 }
            : p
        ),
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, [activePlayer?.id]);

  const addProfile = async (
    name: string,
    gender: Player['gender'],
    avatar: string,
    characterId?: string,
    characterTitle?: string
  ): Promise<Player> => {
    const newPlayer = createNewPlayer(name, gender, avatar, characterId, characterTitle);
    if (user) {
      newPlayer.ownerUid = user.uid;
      try {
        await savePlayerToFirestore(newPlayer, user.uid);
        setIsCloudSynced(true);
      } catch (err) {
        console.error('Failed to save new player to Firestore:', err);
      }
    }
    setGlobalState((prev) => ({
      ...prev,
      profiles: [...prev.profiles, newPlayer],
      activeProfileId: newPlayer.id,
    }));
    return newPlayer;
  };

  const selectCharacterForPlayer = async (playerId: string, character: CharacterDef): Promise<void> => {
    const updates: Partial<Player> = {
      characterId: character.id,
      characterTitle: character.title,
      avatar: character.avatar,
    };
    updateProfile(updates);

    if (user) {
      const target = globalState.profiles.find((p) => p.id === playerId);
      if (target) {
        const merged: Player = { ...target, ...updates };
        try {
          await savePlayerToFirestore(merged, user.uid);
        } catch (e) {
          console.warn('Could not sync character update to Firestore:', e);
        }
      }
    }
  };

  const deleteProfile = async (id: string): Promise<void> => {
    if (user) {
      try {
        await deletePlayerFromFirestore(id);
      } catch (err) {
        console.error('Failed to delete player from Firestore:', err);
      }
    }
    setGlobalState((prev) => {
      const remaining = prev.profiles.filter((p) => p.id !== id);
      const newActive = prev.activeProfileId === id
        ? (remaining.length > 0 ? remaining[0].id : null)
        : prev.activeProfileId;
      return {
        ...prev,
        profiles: remaining,
        activeProfileId: newActive,
      };
    });
  };

  const switchProfile = (id: string) => {
    setGlobalState((prev) => ({ ...prev, activeProfileId: id }));
  };

  const updateProfile = useCallback((updates: Partial<Player>) => {
    setGlobalState((prev) => {
      const updatedProfiles = prev.profiles.map((p) => {
        if (p.id === prev.activeProfileId) {
          const updated = { ...p, ...updates, updatedAt: Date.now() };
          if (user) {
            savePlayerToFirestore(updated, user.uid).catch((err) =>
              console.warn('Background sync error for player:', err)
            );
          }
          return updated;
        }
        return p;
      });
      return { ...prev, profiles: updatedProfiles };
    });
  }, [user]);

  const syncAllToCloud = async () => {
    if (!user) return;
    try {
      for (const p of globalState.profiles) {
        await savePlayerToFirestore(p, user.uid);
      }
      setIsCloudSynced(true);
    } catch (e) {
      console.error('Manual sync error:', e);
    }
  };

  const addStars = (amount: number) => {
    if (!activePlayer) return;
    updateProfile({ stars: (activePlayer.stars || 0) + amount });
  };

  const addGems = (amount: number) => {
    if (!activePlayer) return;
    updateProfile({ gems: (activePlayer.gems || 0) + amount });
  };

  const addGift = () => {
    if (!activePlayer) return;
    updateProfile({
      inventory: {
        ...activePlayer.inventory,
        unopenedGifts: (activePlayer.inventory?.unopenedGifts || 0) + 1,
      },
    });
  };

  const openGift = (itemId: string) => {
    if (!activePlayer) return;
    const inventory = activePlayer.inventory || { items: {}, unopenedGifts: 0, placedItems: { room: [], aquarium: [] } };
    const currentCount = inventory.items[itemId] || 0;
    updateProfile({
      inventory: {
        ...inventory,
        unopenedGifts: Math.max(0, inventory.unopenedGifts - 1),
        items: {
          ...inventory.items,
          [itemId]: currentCount + 1,
        },
      },
    });
  };

  const completeLevel = (levelId: string, category: keyof PlayerProgress) => {
    if (!activePlayer) return;
    if (activePlayer.completedLevels.includes(levelId)) return;

    const newCompleted = [...activePlayer.completedLevels, levelId];
    const inventory = activePlayer.inventory || { items: {}, unopenedGifts: 0, placedItems: { room: [], aquarium: [] } };

    updateProfile({
      completedLevels: newCompleted,
      inventory: {
        ...inventory,
        unopenedGifts: (inventory.unopenedGifts || 0) + 1,
      },
      progress: {
        ...activePlayer.progress,
        [category]: (activePlayer.progress[category] || 0) + 10,
      },
    });
  };

  const discoverUniverseItems = (itemIds: string[]) => {
    if (!activePlayer) return;
    const currentDiscovered = activePlayer.discoveredUniverseItems || [];
    const newDiscovered = Array.from(new Set([...currentDiscovered, ...itemIds]));
    updateProfile({
      discoveredUniverseItems: newDiscovered,
    });
  };

  const awardGameCompletion = (gameId: string, category: keyof PlayerProgress, starsEarned: number): RewardItem | null => {
    if (!activePlayer) return null;

    const rewardOpts = getRandomRewards(1);
    const reward = rewardOpts[0];

    const inventory = activePlayer.inventory || { items: {}, unopenedGifts: 0, placedItems: { room: [], aquarium: [] } };
    const currentCount = inventory.items[reward.id] || 0;

    const newCompleted = activePlayer.completedLevels.includes(gameId)
      ? activePlayer.completedLevels
      : [...activePlayer.completedLevels, gameId];

    updateProfile({
      stars: (activePlayer.stars || 0) + starsEarned,
      completedLevels: newCompleted,
      inventory: {
        ...inventory,
        items: {
          ...inventory.items,
          [reward.id]: currentCount + 1,
        },
      },
      progress: {
        ...activePlayer.progress,
        [category]: Math.min(100, (activePlayer.progress[category] || 0) + 10),
      },
    });

    return reward;
  };

  const toggleAudio = () => setGlobalState((prev) => ({ ...prev, isAudioEnabled: !prev.isAudioEnabled }));
  const toggleMusic = () => setGlobalState((prev) => ({ ...prev, isMusicEnabled: !prev.isMusicEnabled }));

  const resetProgress = () => {
    if (!activePlayer) return;
    const newPlayer = createNewPlayer(activePlayer.name, activePlayer.gender, activePlayer.avatar);
    newPlayer.id = activePlayer.id; // Keep the same ID
    if (user) {
      savePlayerToFirestore(newPlayer, user.uid).catch(console.error);
    }
    setGlobalState((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) => (p.id === prev.activeProfileId ? newPlayer : p)),
    }));
  };

  // Backwards compatibility object
  const stateCompat = {
    player: activePlayer || createNewPlayer('زائر', 'prefer_not_to_say', '👤'),
    isAudioEnabled: globalState.isAudioEnabled,
    isMusicEnabled: globalState.isMusicEnabled,
  };

  return (
    <GameContext.Provider
      value={{
        globalState,
        state: stateCompat,
        activePlayer,
        isCloudSynced,
        gameConfigs,
        updateGameConfig,
        selectCharacterForPlayer,
        addProfile,
        deleteProfile,
        switchProfile,
        updateProfile,
        addStars,
        addGems,
        addGift,
        openGift,
        completeLevel,
        awardGameCompletion,
        discoverUniverseItems,
        toggleAudio,
        toggleMusic,
        resetProgress,
        syncAllToCloud,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
