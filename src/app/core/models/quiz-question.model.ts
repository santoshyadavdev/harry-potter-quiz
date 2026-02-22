export type QuestionCategory = 'house' | 'actor' | 'patronus' | 'spell';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  category?: QuestionCategory;
}
