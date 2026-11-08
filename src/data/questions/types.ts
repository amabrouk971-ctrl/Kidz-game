export type QuestionType = 'identify' | 'scenario' | 'count';

export interface QuestionOption {
  id: string;
  text?: string;
  icon?: string;
  image?: string;
  audio?: string;
}

export interface Question {
  id: string;
  categoryId: string;
  type: QuestionType;
  difficulty: number;
  questionText: string;
  questionAudio?: string;
  options: QuestionOption[];
  correctOptionId: string;
  hint?: string;
}
