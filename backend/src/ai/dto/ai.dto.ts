export interface WordAnalysisDto {
  word: string;
}

export interface QuizGenerateDto {
  words: { id: number; word: string; meaning: string; phonetic: string; example: string }[];
  count?: number;
}

export interface SentenceGenerateDto {
  word: string;
  meaning: string;
  context?: string;
}

export interface SentenceCheckDto {
  sentence: string;
  word: string;
  meaning: string;
}

export interface ChatMessageDto {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  scenario?: string;
}

export interface PronunciationEvalDto {
  word: string;
  phonetic: string;
  recognizedText: string;
}

export interface EssayCheckDto {
  essay: string;
  topic?: string;
  level?: string;
}

export interface ReportGenerateDto {
  totalCorrect: number;
  totalWrong: number;
  learnedWords: number;
  totalWords: number;
  streakDays: number;
  studyTime: number;
  wrongWords: { word: string; meaning: string }[];
  masteredWords: number;
  level: number;
}

export interface RecommendDto {
  learnedWords: number;
  totalWords: number;
  wrongRate: number;
  level: number;
  category: string;
  recentTopics?: string[];
}
