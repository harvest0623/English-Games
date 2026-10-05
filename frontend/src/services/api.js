const API_BASE_URL = 'http://localhost:3002/api';

async function fetchApi(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const vocabularyApi = {
  // 获取所有词库分类
  getCategories: () => fetchApi('/vocabulary/categories'),

  // 获取单个分类详情
  getCategoryById: (id) => fetchApi(`/vocabulary/categories/${id}`),

  // 获取单词列表（支持筛选和分页）
  getWords: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.difficulty) query.append('difficulty', params.difficulty);
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page);
    if (params.pageSize) query.append('pageSize', params.pageSize);
    return fetchApi(`/vocabulary/words?${query.toString()}`);
  },

  // 获取单个单词详情
  getWordById: (id) => fetchApi(`/vocabulary/words/${id}`),

  // 获取分类下的所有单词
  getWordsByCategory: (categoryId) => fetchApi(`/vocabulary/categories/${categoryId}/words`),

  // 获取随机单词
  getRandomWords: (count = 10) => fetchApi(`/vocabulary/words/random?count=${count}`),
};

export const aiApi = {
  analyzeWord: (word) => fetchApi('/ai/analyze-word', { method: 'POST', body: JSON.stringify({ word }) }),

  generateQuiz: (words, count = 5) => fetchApi('/ai/quiz', { method: 'POST', body: JSON.stringify({ words, count }) }),

  generateSentence: (word, meaning, context) => fetchApi('/ai/sentence', { method: 'POST', body: JSON.stringify({ word, meaning, context }) }),

  checkSentence: (sentence, word, meaning) => fetchApi('/ai/check-sentence', { method: 'POST', body: JSON.stringify({ sentence, word, meaning }) }),

  generateReport: (data) => fetchApi('/ai/report', { method: 'POST', body: JSON.stringify(data) }),

  recommendPath: (data) => fetchApi('/ai/recommend', { method: 'POST', body: JSON.stringify(data) }),

  chat: (message, history = [], scenario) => fetchApi('/ai/chat', { method: 'POST', body: JSON.stringify({ message, history, scenario }) }),

  evaluatePronunciation: (word, phonetic, recognizedText) => fetchApi('/ai/evaluate-pronunciation', { method: 'POST', body: JSON.stringify({ word, phonetic, recognizedText }) }),

  checkEssay: (essay, topic, level) => fetchApi('/ai/check-essay', { method: 'POST', body: JSON.stringify({ essay, topic, level }) }),
};
