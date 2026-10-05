import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AIService {
  private apiKey: string;
  private apiUrl: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.AI_API_KEY || '';
    this.apiUrl = process.env.AI_API_URL || 'https://api.deepseek.com';
    this.model = process.env.AI_MODEL || 'deepseek-chat';
  }

  private isConfigured(): boolean {
    return !!this.apiKey;
  }

  private async callAI(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('AI API 未配置，请在 .env 文件中设置 AI_API_KEY');
    }

    const messages: any[] = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    try {
      const response = await axios.post(
        `${this.apiUrl}/v1/chat/completions`,
        {
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 2000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('AI API Key 无效，请检查配置');
      }
      throw new Error(`AI 调用失败: ${error.message}`);
    }
  }

  private parseJSON<T>(text: string): T {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  }

  async analyzeWord(word: string) {
    const systemPrompt = `你是一位专业的英语词源学专家。分析给定的英语单词，返回严格的JSON格式。
返回格式：
{
  "word": "单词",
  "roots": [{"root": "词根", "origin": "来源语言", "meaning": "含义"}],
  "prefixes": [{"prefix": "前缀", "origin": "来源", "meaning": "含义"}],
  "suffixes": [{"suffix": "后缀", "origin": "来源", "meaning": "含义"}],
  "etymology": "词源故事（50-100字中文）",
  "cognates": ["同源词1", "同源词2"],
  "mnemonic": "记忆技巧（一句话）"
}
只返回JSON，不要其他内容。`;

    const result = await this.callAI(
      `请分析单词 "${word}" 的词根词缀和词源。`,
      systemPrompt,
    );
    return this.parseJSON(result);
  }

  async generateQuiz(words: { word: string; meaning: string; phonetic: string; example: string }[], count: number = 5) {
    const wordList = words.map(w => `${w.word} - ${w.meaning}`).join('\n');
    const systemPrompt = `你是一位英语教学专家。根据给定的单词列表，生成多种题型的练习题。返回严格的JSON格式。
返回格式：
{
  "questions": [
    {
      "type": "choice",
      "question": "题目描述",
      "options": ["A选项", "B选项", "C选项", "D选项"],
      "answer": "正确答案",
      "explanation": "解析"
    },
    {
      "type": "fill",
      "question": "填空题，用___表示空格",
      "answer": "正确答案",
      "explanation": "解析"
    },
    {
      "type": "match",
      "question": "配对题描述",
      "options": [{"left": "英文", "right": "中文释义"}],
      "answer": "配对结果",
      "explanation": "解析"
    }
  ]
}
只返回JSON，不要其他内容。`;

    const result = await this.callAI(
      `单词列表：\n${wordList}\n\n请生成 ${count} 道练习题，包含选择题、填空题和配对题。`,
      systemPrompt,
    );
    return this.parseJSON(result);
  }

  async generateSentence(word: string, meaning: string, context?: string) {
    const systemPrompt = `你是一位英语教学专家。为给定的单词生成3个不同场景的例句。返回严格的JSON格式。
返回格式：
{
  "sentences": [
    {
      "sentence": "英文例句",
      "translation": "中文翻译",
      "scenario": "使用场景",
      "difficulty": "easy/medium/hard"
    }
  ]
}
只返回JSON，不要其他内容。`;

    const contextHint = context ? `\n用户希望的场景：${context}` : '';
    const result = await this.callAI(
      `单词：${word}\n释义：${meaning}${contextHint}\n\n请生成3个不同场景的例句。`,
      systemPrompt,
    );
    return this.parseJSON(result);
  }

  async checkSentence(sentence: string, word: string, meaning: string) {
    const systemPrompt = `你是一位英语批改老师。评估学生用指定单词造的句子。返回严格的JSON格式。
返回格式：
{
  "score": 0-100的分数,
  "correct": true/false（语法是否正确）,
  "grammar": "语法分析（如有错误请指出）",
  "vocabulary": "词汇使用评价",
  "suggestion": "改进建议",
  "betterSentence": "更好的表达方式（如果原句不够好）"
}
只返回JSON，不要其他内容。`;

    const result = await this.callAI(
      `目标单词：${word}（${meaning}）\n学生造句：${sentence}\n\n请评估这个句子。`,
      systemPrompt,
    );
    return this.parseJSON(result);
  }

  async generateReport(data: any) {
    const systemPrompt = `你是一位英语学习顾问。根据学生的学习数据生成个性化学习报告。返回严格的JSON格式。
返回格式：
{
  "overallLevel": "初学者/进阶/高级",
  "summary": "总体评价（50字内）",
  "strengths": ["优势1", "优势2"],
  "weaknesses": ["不足1", "不足2"],
  "suggestions": [{"title": "建议标题", "detail": "具体建议", "priority": "high/medium/low"}],
  "weeklyGoal": "本周学习目标",
  "encouragement": "鼓励语"
}
只返回JSON，不要其他内容。`;

    const result = await this.callAI(
      `学习数据：\n- 答对题数：${data.totalCorrect}\n- 答错题数：${data.totalWrong}\n- 已学单词：${data.learnedWords}/${data.totalWords}\n- 连续学习天数：${data.streakDays}天\n- 学习时长：${data.studyTime}分钟\n- 掌握单词数：${data.masteredWords}\n- 玩家等级：${data.level}\n- 错词数：${data.wrongWords?.length || 0}\n- 错词列表：${data.wrongWords?.map((w: any) => w.word).join(', ') || '无'}`,
      systemPrompt,
    );
    return this.parseJSON(result);
  }

  async recommendPath(data: any) {
    const systemPrompt = `你是一位英语学习规划师。根据学生情况推荐学习路径。返回严格的JSON格式。
返回格式：
{
  "recommendations": [
    {
      "category": "学习类别（如：词汇/语法/阅读/听力/口语）",
      "title": "推荐标题",
      "description": "详细说明",
      "targetWords": ["建议学习的单词"],
      "estimatedTime": "预计时间",
      "difficulty": "easy/medium/hard"
    }
  ],
  "nextCategory": "建议下一个学习的词库",
  "focusArea": "最需要加强的领域",
  "dailyPlan": "每日学习计划建议"
}
只返回JSON，不要其他内容。`;

    const result = await this.callAI(
      `学习情况：\n- 已学单词：${data.learnedWords}/${data.totalWords}\n- 错误率：${data.wrongRate}%\n- 玩家等级：${data.level}\n- 当前词库：${data.category}`,
      systemPrompt,
    );
    return this.parseJSON(result);
  }

  async chat(message: string, history: { role: 'user' | 'assistant'; content: string }[], scenario?: string) {
    const systemPrompt = `你是一位友善的英语外教。与学生进行英语对话练习。

规则：
1. 根据场景设定进行对话（如果指定了场景）
2. 在回复后附上中文翻译
3. 如果学生犯了语法或用词错误，在回复中温和地纠正
4. 保持对话自然流畅，难度适中
5. 鼓励学生多说

${scenario ? `当前场景：${scenario}` : '自由对话模式'}`;

    const messages: any[] = [{ role: 'system', content: systemPrompt }];
    if (history) {
      messages.push(...history);
    }
    messages.push({ role: 'user', content: message });

    try {
      const response = await axios.post(
        `${this.apiUrl}/v1/chat/completions`,
        {
          model: this.model,
          messages,
          temperature: 0.8,
          max_tokens: 1000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return { reply: response.data.choices[0].message.content };
    } catch (error) {
      throw new Error(`AI 对话失败: ${error.message}`);
    }
  }

  async evaluatePronunciation(word: string, phonetic: string, recognizedText: string) {
    const isCorrect = recognizedText.toLowerCase().trim() === word.toLowerCase().trim();
    const similarity = this.calculateSimilarity(recognizedText.toLowerCase(), word.toLowerCase());

    let feedback = '';
    let score = 0;

    if (similarity >= 0.9) {
      score = Math.round(85 + similarity * 15);
      feedback = '发音非常准确！继续保持！';
    } else if (similarity >= 0.7) {
      score = Math.round(60 + similarity * 25);
      feedback = `接近正确了！正确发音是 ${word}（${phonetic}），注意发音细节。`;
    } else if (similarity >= 0.4) {
      score = Math.round(30 + similarity * 30);
      feedback = `还需要多练习。目标单词是 ${word}（${phonetic}），试着多听几遍再跟读。`;
    } else {
      score = Math.round(similarity * 30);
      feedback = `没有识别到正确的单词。请听清楚后再说一次，目标是 ${word}（${phonetic}）。`;
    }

    return { score, feedback, recognized: recognizedText, target: word, similarity };
  }

  async checkEssay(essay: string, topic?: string, level?: string) {
    const systemPrompt = `你是一位英语作文批改老师。批改学生的英语作文。返回严格的JSON格式。
返回格式：
{
  "totalScore": 0-100,
  "grammarScore": 0-100,
  "vocabularyScore": 0-100,
  "structureScore": 0-100,
  "contentScore": 0-100,
  "grammarErrors": [{"original": "错误原文", "corrected": "正确写法", "explanation": "解释"}],
  "vocabularyFeedback": "词汇使用评价",
  "structureFeedback": "文章结构评价",
  "contentFeedback": "内容评价",
  "overallFeedback": "总体评价",
  "improvedVersion": "修改后的优秀版本",
  "keySuggestions": ["建议1", "建议2", "建议3"]
}
只返回JSON，不要其他内容。`;

    const topicHint = topic ? `\n作文主题：${topic}` : '';
    const levelHint = level ? `\n学生水平：${level}` : '';
    const result = await this.callAI(
      `请批改以下英语作文：\n\n${essay}${topicHint}${levelHint}`,
      systemPrompt,
    );
    return this.parseJSON(result);
  }

  private calculateSimilarity(a: string, b: string): number {
    if (a === b) return 1;
    const longer = a.length > b.length ? a : b;
    const shorter = a.length > b.length ? b : a;
    if (longer.length === 0) return 1;
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b[i - 1] === a[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }
}
