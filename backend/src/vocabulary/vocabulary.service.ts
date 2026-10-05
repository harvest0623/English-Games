import { Injectable } from '@nestjs/common';
import { WordDto, CategoryDto, VocabularyResponseDto } from './dto/word.dto';
import { words, categories } from './data/vocabulary.data';

@Injectable()
export class VocabularyService {
  private wordList: WordDto[] = words;
  private categoryList: CategoryDto[] = categories;

  findAllCategories(): CategoryDto[] {
    return this.categoryList;
  }

  findCategoryById(id: string): CategoryDto | undefined {
    return this.categoryList.find((c) => c.id === id);
  }

  findWords(
    category?: string,
    difficulty?: string,
    search?: string,
    page: number = 1,
    pageSize: number = 20,
  ): VocabularyResponseDto {
    let result = [...this.wordList];

    if (category) {
      result = result.filter((w) => w.category === category);
    }

    if (difficulty) {
      result = result.filter((w) => w.difficulty === difficulty);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (w) =>
          w.word.toLowerCase().includes(lowerSearch) ||
          w.meaning.includes(search),
      );
    }

    const total = result.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedWords = result.slice(start, end);

    return {
      words: paginatedWords,
      total,
      page,
      pageSize,
    };
  }

  findWordById(id: string): WordDto | undefined {
    return this.wordList.find((w) => w.id === id);
  }

  getWordsByCategory(categoryId: string): WordDto[] {
    return this.wordList.filter((w) => w.category === categoryId);
  }

  getRandomWords(count: number = 10): WordDto[] {
    const shuffled = [...this.wordList].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
}
