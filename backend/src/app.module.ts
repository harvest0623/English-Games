import { Module } from '@nestjs/common';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { AIModule } from './ai/ai.module';

@Module({
  imports: [VocabularyModule, AIModule],
})
export class AppModule {}
