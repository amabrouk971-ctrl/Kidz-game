import { RewardItem } from '../types';

export const REWARDS: RewardItem[] = [
  // Toys
  { id: 'teddy_bear', name: 'دبدوب', icon: '🧸', category: 'toys', rarity: 'common' },
  { id: 'bunny', name: 'أرنب', icon: '🐰', category: 'toys', rarity: 'rare' },
  { id: 'toy_car', name: 'عربية لعبة', icon: '🚗', category: 'toys', rarity: 'common' },
  { id: 'puzzle', name: 'بازل', icon: '🧩', category: 'toys', rarity: 'rare' },
  { id: 'balloon', name: 'بالون', icon: '🎈', category: 'toys', rarity: 'common' },
  
  // Friends
  { id: 'cat', name: 'قطة', icon: '🐱', category: 'friends', rarity: 'epic' },
  { id: 'puppy', name: 'كلب', icon: '🐶', category: 'friends', rarity: 'epic' },
  { id: 'unicorn', name: 'يونيكورن', icon: '🦄', category: 'friends', rarity: 'legendary' },
  
  // Decor
  { id: 'flower', name: 'وردة', icon: '🌸', category: 'decor', rarity: 'common' },
  { id: 'star_decor', name: 'نجمة زينة', icon: '⭐', category: 'decor', rarity: 'common' },
  { id: 'rainbow', name: 'قوس قزح', icon: '🌈', category: 'decor', rarity: 'rare' },
  { id: 'castle', name: 'قلعة', icon: '🏰', category: 'decor', rarity: 'legendary' },
  { id: 'small_house', name: 'بيت صغير', icon: '🏠', category: 'decor', rarity: 'epic' },
  
  // Clothes & Accessories
  { id: 'crown', name: 'تاج', icon: '👑', category: 'clothes', rarity: 'legendary' },
  { id: 'bow', name: 'فيونكة', icon: '🎀', category: 'clothes', rarity: 'common' },
  { id: 'sunglasses', name: 'نظارة شمس', icon: '🕶️', category: 'clothes', rarity: 'rare' },
  { id: 'backpack', name: 'شنطة ظهر', icon: '🎒', category: 'clothes', rarity: 'epic' },

  // Flight
  { id: 'toy_airplane', name: 'طيارة لعبة', icon: '✈️', category: 'flight', rarity: 'rare' },
  { id: 'wings_badge', name: 'شارة طيران', icon: '⭐', category: 'flight', rarity: 'epic' },
  
  // Swimming & Aquarium
  { id: 'fish', name: 'سمكة', icon: '🐠', category: 'swimming', rarity: 'common' },
  { id: 'seashell', name: 'صدفة', icon: '🐚', category: 'swimming', rarity: 'rare' },
  { id: 'crab', name: 'كابوريا', icon: '🦀', category: 'swimming', rarity: 'epic' },
  { id: 'dolphin', name: 'دلفين', icon: '🐬', category: 'swimming', rarity: 'legendary' },
  
  // Education & Rewards
  { id: 'book', name: 'كتاب', icon: '📚', category: 'education', rarity: 'common' },
  { id: 'paint_set', name: 'ألوان', icon: '🎨', category: 'education', rarity: 'rare' },
  { id: 'apple', name: 'تفاحة', icon: '🍎', category: 'rewards', rarity: 'common' },
  { id: 'candy', name: 'حلاوة', icon: '🍭', category: 'rewards', rarity: 'common' },
  { id: 'gem', name: 'جوهرة', icon: '💎', category: 'rewards', rarity: 'epic' },
  { id: 'quran_book', name: 'مصحف', icon: '📖', category: 'education', rarity: 'legendary' },
  { id: 'mosque_decor', name: 'مسجد', icon: '🕌', category: 'decor', rarity: 'epic' },
];

export const getRandomRewards = (count: number = 3): RewardItem[] => {
  const shuffled = [...REWARDS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
