export interface WordDto {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface CategoryDto {
  id: string;
  name: string;
  description: string;
  icon: string;
  wordCount: number;
  color: string;
}

export interface VocabularyResponseDto {
  words: WordDto[];
  total: number;
  page: number;
  pageSize: number;
}
