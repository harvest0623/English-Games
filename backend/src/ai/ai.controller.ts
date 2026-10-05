import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AIService } from './ai.service';

@Controller('api/ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('analyze-word')
  async analyzeWord(@Body() body: { word: string }) {
    if (!body.word) {
      throw new BadRequestException('缺少 word 参数');
    }
    return this.aiService.analyzeWord(body.word);
  }

  @Post('quiz')
  async generateQuiz(@Body() body: { words: any[]; count?: number }) {
    if (!body.words || body.words.length === 0) {
      throw new BadRequestException('缺少 words 参数');
    }
    return this.aiService.generateQuiz(body.words, body.count || 5);
  }

  @Post('sentence')
  async generateSentence(@Body() body: { word: string; meaning: string; context?: string }) {
    if (!body.word || !body.meaning) {
      throw new BadRequestException('缺少 word 或 meaning 参数');
    }
    return this.aiService.generateSentence(body.word, body.meaning, body.context);
  }

  @Post('check-sentence')
  async checkSentence(@Body() body: { sentence: string; word: string; meaning: string }) {
    if (!body.sentence || !body.word || !body.meaning) {
      throw new BadRequestException('缺少必要参数');
    }
    return this.aiService.checkSentence(body.sentence, body.word, body.meaning);
  }

  @Post('report')
  async generateReport(@Body() body: any) {
    return this.aiService.generateReport(body);
  }

  @Post('recommend')
  async recommendPath(@Body() body: any) {
    return this.aiService.recommendPath(body);
  }

  @Post('chat')
  async chat(@Body() body: { message: string; history?: any[]; scenario?: string }) {
    if (!body.message) {
      throw new BadRequestException('缺少 message 参数');
    }
    return this.aiService.chat(body.message, body.history || [], body.scenario);
  }

  @Post('evaluate-pronunciation')
  async evaluatePronunciation(@Body() body: { word: string; phonetic: string; recognizedText: string }) {
    if (!body.word || !body.recognizedText) {
      throw new BadRequestException('缺少必要参数');
    }
    return this.aiService.evaluatePronunciation(body.word, body.phonetic || '', body.recognizedText);
  }

  @Post('check-essay')
  async checkEssay(@Body() body: { essay: string; topic?: string; level?: string }) {
    if (!body.essay) {
      throw new BadRequestException('缺少 essay 参数');
    }
    return this.aiService.checkEssay(body.essay, body.topic, body.level);
  }
}
