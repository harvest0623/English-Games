import { Controller, Get, Query, Param } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { WordDto, CategoryDto, VocabularyResponseDto } from './dto/word.dto';

@Controller('api/vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Get('categories')
  getCategories(): CategoryDto[] {
    return this.vocabularyService.findAllCategories();
  }

  @Get('categories/:id')
  getCategoryById(@Param('id') id: string): CategoryDto | undefined {
    return this.vocabularyService.findCategoryById(id);
  }

  @Get('words')
  getWords(
    @Query('category') category?: string,
    @Query('difficulty') difficulty?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): VocabularyResponseDto {
    return this.vocabularyService.findWords(
      category,
      difficulty,
      search,
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
    );
  }

  @Get('words/:id')
  getWordById(@Param('id') id: string): WordDto | undefined {
    return this.vocabularyService.findWordById(id);
  }

  @Get('categories/:id/words')
  getWordsByCategory(@Param('id') categoryId: string): WordDto[] {
    return this.vocabularyService.getWordsByCategory(categoryId);
  }

  @Get('words/random')
  getRandomWords(@Query('count') count?: string): WordDto[] {
    return this.vocabularyService.getRandomWords(
      count ? parseInt(count, 10) : 10,
    );
  }
}
