export type PlayerProgress = {
  swimming: number;
  colors: number;
  numbers: number;
  letters: number;
  shapes: number;
  memory: number;
  politeness: number;
  flightAcademy: number;
  quran: number;
  religiousKnowledge: number;
  professions: number;
  generalKnowledge: number;
};

export type ItemCategory = 'toys' | 'clothes' | 'friends' | 'decor' | 'flight' | 'swimming' | 'education' | 'rewards';
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type RewardItem = {
  id: string;
  name: string;
  icon: string;
  category: ItemCategory;
  rarity: ItemRarity;
};

export type PlayerInventory = {
  items: Record<string, number>;
  unopenedGifts: number;
  placedItems: {
    room: string[];
    aquarium: string[];
  };
};

export type CharacterDef = {
  id: string;
  name: string;
  avatar: string;
  gender: 'boy' | 'girl' | 'prefer_not_to_say';
  title: string;
  tagline: string;
  themeColor: string;
  bgGradient: string;
  badge: string;
  specialty: string;
};

export type GameQuestionCustom = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  hint?: string;
};

export type GameConfig = {
  id: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
  isEnabled: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  rewardStars: number;
  orderIndex: number;
  customQuestions?: GameQuestionCustom[];
  updatedAt?: number;
};

export type Player = {
  id: string;
  name: string;
  gender: 'boy' | 'girl' | 'prefer_not_to_say';
  avatar: string;
  characterId?: string;
  characterTitle?: string;
  level: number;
  stars: number;
  gems: number;
  badges: string[];
  completedLevels: string[];
  progress: PlayerProgress;
  timePlayedSeconds: number;
  createdAt: number;
  inventory: PlayerInventory;
  universeProgress?: Record<string, number>;
  discoveredUniverseItems?: string[];
  ownerUid?: string;
  updatedAt?: number;
};

export type UserRole = 'admin' | 'parent' | 'user';

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  role: UserRole;
  createdAt: number;
  lastLoginAt: number;
  provider?: string;
};

export type SignInLog = {
  id: string;
  userId: string;
  email: string;
  displayName: string;
  role: UserRole;
  timestamp: number;
  userAgent?: string;
};

export type GlobalState = {
  profiles: Player[];
  activeProfileId: string | null;
  isAudioEnabled: boolean;
  isMusicEnabled: boolean;
};

export type Level = {
  id: string;
  world: string;
  title: string;
  type: 'learning' | 'quiz' | 'minigame';
  difficulty: number;
  reward: { stars: number; gems: number };
  requiredLevel: number;
  completed: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
};
