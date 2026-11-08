import { Question, QuestionOption } from './types';
import { UNIVERSE_OBJECTS } from '../universe/objects';
import { UniverseCategory } from '../universe/types';

export const generateUniverseQuestions = (categoryId: string, count: number = 10): Question[] => {
  const objects = categoryId === 'general' ? UNIVERSE_OBJECTS : UNIVERSE_OBJECTS.filter(o => o.categoryId === categoryId);
  if (objects.length === 0) return [];

  const questions: Question[] = [];
  const templates = [
    (name: string) => `فين الـ ${name}؟`,
    (name: string) => `مين فيهم ${name}؟`,
    (name: string) => `طلعي الـ ${name}`,
  ];

  for (let i = 0; i < count; i++) {
    const target = objects[Math.floor(Math.random() * objects.length)];
    
    // Pick 2-3 wrong options from SAME category if possible, else from ANY category
    let optionsList = objects.filter(o => o.id !== target.id);
    if (optionsList.length < 2) {
      optionsList = UNIVERSE_OBJECTS.filter(o => o.id !== target.id);
    }
    
    // shuffle options
    optionsList.sort(() => 0.5 - Math.random());
    const wrongOptions = optionsList.slice(0, 2); // 3 options total
    
    const allOptions = [target, ...wrongOptions].sort(() => 0.5 - Math.random());
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    questions.push({
      id: `${categoryId}_q_${i}_${Date.now()}`,
      categoryId,
      type: 'identify',
      difficulty: 1,
      questionText: template(target.arabicName),
      correctOptionId: target.id,
      options: allOptions.map(o => ({
        id: o.id,
        icon: o.icon,
        text: o.arabicName
      }))
    });
  }
  
  return questions;
};
