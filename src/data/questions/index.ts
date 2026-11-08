import { Question } from './types';
import { generateUniverseQuestions } from './generator';
import { STATIC_QUESTIONS } from './static';

export * from './types';

export const CATEGORY_ALIASES: Record<string, string> = {
  politeness: 'manners',
  jobs: 'professions',
  flightAcademy: 'transportation',
  flight: 'transportation',
  swim: 'swimming',
  mem: 'general',
  memory: 'general',
  num: 'numbers',
  let: 'letters',
  shape: 'shapes',
  color: 'colors',
};

export const getQuestionsForCategory = (categoryId: string, count: number = 10): Question[] => {
  let questions: Question[] = [];
  const mappedCategory = CATEGORY_ALIASES[categoryId] || categoryId;
  
  if (STATIC_QUESTIONS[mappedCategory] || STATIC_QUESTIONS[categoryId]) {
    const source = STATIC_QUESTIONS[mappedCategory] || STATIC_QUESTIONS[categoryId];
    // Clone and shuffle static questions
    questions = [...source].sort(() => 0.5 - Math.random());
    
    // Shuffle options for each question
    questions = questions.map(q => ({
      ...q,
      options: [...q.options].sort(() => 0.5 - Math.random())
    }));
  } else {
    // Generate dynamically for universe objects
    questions = generateUniverseQuestions(mappedCategory, count);
    if (questions.length === 0 && mappedCategory !== categoryId) {
      questions = generateUniverseQuestions(categoryId, count);
    }
  }

  // Safety fallback: if no questions found, fallback to general knowledge questions
  if (questions.length === 0) {
    questions = generateUniverseQuestions('general', count);
  }

  return questions.slice(0, count);
};
