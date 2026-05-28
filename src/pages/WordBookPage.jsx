import { useState } from 'react';
import { BookOpen, Heart, Trash2, RotateCcw, Search, Filter, Star, X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { words } from '../data/gameData';

const WordBookPage = () => {
  const { player, toggleFavorite, removeWrongWord } = useGame();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getWordData = (wordId) => words.find(w => w.id === wordId);

  const filteredWords = () => {
    let wordList = [];
    switch (activeTab) {
      case 'all':
        wordList = player.learnedWords || [];
        break;
      case 'wrong':
        wordList = player.wrongWords || [];
        break;
      case 'favorite':
        wordList = player.favoriteWords || [];
        break;
      default:
        wordList = player.learnedWords || [];
    }

    if (searchQuery) {
      wordList = wordList.filter(id => {
        const word = getWordData(id);
        return word && (word.word.toLowerCase().includes(searchQuery.toLowerCase()) || word.meaning.includes(searchQuery));
      });
    }

    return wordList.map(id => getWordData(id)).filter(Boolean);
  };

  const getMasteryLevel = (wordId) => {
    const mastery = player.wordMastery?.[wordId] || 0;
    if (mastery >= 5) return { level: '掌握', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (mastery >= 3) return { level: '熟悉', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (mastery >= 1) return { level: '初学', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { level: '陌生', color: 'text-gray-400', bg: 'bg-gray-500/20' };
  };

  const wordList = filteredWords();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gradient font-display flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-violet-400" />
          单词本
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>已学 {player.learnedWords?.length || 0}</span>
          <span>·</span>
          <span>错题 {player.wrongWords?.length || 0}</span>
          <span>·</span>
          <span>收藏 {player.favoriteWords?.length || 0}</span>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索单词或释义..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
          />
        </div>
        <div className="flex gap-2">
          {[
            { id: 'all', label: '全部', count: player.learnedWords?.length || 0 },
            { id: 'wrong', label: '错题', count: player.wrongWords?.length || 0 },
            { id: 'favorite', label: '收藏', count: player.favoriteWords?.length || 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* 单词列表 */}
      <div className="space-y-3">
        {wordList.map((word) => {
          const mastery = getMasteryLevel(word.id);
          const isFavorite = player.favoriteWords?.includes(word.id);
          const isWrong = player.wrongWords?.includes(word.id);

          return (
            <div key={word.id} className="glass-card rounded-xl p-4 hover:border-violet-500/30 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">{word.word}</h3>
                    <span className="text-sm text-gray-400">{word.phonetic}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${mastery.bg} ${mastery.color}`}>
                      {mastery.level}
                    </span>
                    {isWrong && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                        错题
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 mb-1">{word.meaning}</p>
                  <p className="text-sm text-gray-500 italic">{word.example}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleFavorite(word.id)}
                    className={`p-2 rounded-lg transition-all ${
                      isFavorite ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-gray-500 hover:text-red-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  {isWrong && (
                    <button
                      onClick={() => removeWrongWord(word.id)}
                      className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-green-400 transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {wordList.length === 0 && (
          <div className="glass-card rounded-xl p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">
              {searchQuery ? '没有找到匹配的单词' : '暂无单词记录'}
            </p>
            <p className="text-sm text-gray-500">
              {searchQuery ? '尝试其他搜索词' : '去冒险中学习新单词吧！'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordBookPage;
