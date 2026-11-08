export type UniverseCategory = 
  | 'vegetables' | 'fruits' | 'clothes' | 'animals' | 'birds' 
  | 'sea_creatures' | 'body_parts' | 'home' | 'actions' 
  | 'toys' | 'transportation' | 'food' | 'drinks' | 'tools' 
  | 'school' | 'weather' | 'family' | 'feelings' | 'professions' | 'general';

export interface UniverseObject {
  id: string;
  categoryId: UniverseCategory;
  arabicName: string;
  egyptianArabicName?: string;
  englishName: string;
  icon: string;
  difficulty: number;
  audio?: string;
  color?: string;
}

export interface UniverseCategoryInfo {
  id: UniverseCategory;
  title: string;
  icon: string;
  color: string;
  bgGradient: string;
}
