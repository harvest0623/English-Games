import { useState } from 'react';
import { BookOpen, Heart, Trash2, RotateCcw, Search, Star, Download, Filter, ChevronDown, Volume2, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { words } from '../data/gameData';

const WordBookPage = () => {
  const navigate = useNavigate();
  const { player, toggleFavorite, removeWrongWord } = useGame();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [expandedWord, setExpandedWord] = useState(null);

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

    let result = wordList.map(id => getWordData(id)).filter(Boolean);

    if (sortOrder === 'mastery-asc') {
      result.sort((a, b) => (player.wordMastery?.[a.id]?.level || 0) - (player.wordMastery?.[b.id]?.level || 0));
    } else if (sortOrder === 'mastery-desc') {
      result.sort((a, b) => (player.wordMastery?.[b.id]?.level || 0) - (player.wordMastery?.[a.id]?.level || 0));
    }

    return result;
  };

  const getMasteryLevel = (wordId) => {
    const mastery = player.wordMastery?.[wordId];
    if (!mastery || typeof mastery === 'number') {
      const count = mastery || 0;
      if (count >= 5) return { level: '掌握', color: 'text-green-400', bg: 'bg-green-500/20' };
      if (count >= 3) return { level: '熟悉', color: 'text-blue-400', bg: 'bg-blue-500/20' };
      if (count >= 1) return { level: '初学', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
      return { level: '陌生', color: 'text-gray-400', bg: 'bg-gray-500/20' };
    }
    const level = mastery.level || 0;
    if (level >= 5) return { level: '掌握', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (level >= 3) return { level: '熟悉', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (level >= 1) return { level: '初学', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { level: '陌生', color: 'text-gray-400', bg: 'bg-gray-500/20' };
  };

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const exportWords = () => {
    const wordList = filteredWords();
    const text = wordList.map(w => `${w.word}\t${w.phonetic}\t${w.meaning}\t${w.example}`).join('\n');
    const header = '单词\t音标\t释义\t例句\n';
    const blob = new Blob([header + text], { type: 'text/tab-separated-values;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `单词本_${activeTab}_${new Date().toLocaleDateString()}.tsv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordList = filteredWords();

  const tabs = [
    { id: 'all', label: '全部', count: player.learnedWords?.length || 0, icon: BookOpen },
    { id: 'wrong', label: '错题', count: player.wrongWords?.length || 0, icon: RotateCcw },
    { id: 'favorite', label: '收藏', count: player.favoriteWords?.length || 0, icon: Heart },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gradient font-display flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-violet-400" />
          单词本
        </h1>
        <div className="flex items-center gap-2">
          {activeTab === 'wrong' && player.wrongWords?.length > 0 && (
            <button
              onClick={() => navigate('/learn')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/10 text-amber-400 text-sm hover:bg-amber-500/20 transition-all"
            >
              <Brain className="w-4 h-4" />
              强化错题
            </button>
          )}
          <button
            onClick={exportWords}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-gray-400 text-sm hover:bg-white/10 transition-all"
          >
            <Download className="w-4 h-4" />
            导出
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>已学 {player.learnedWords?.length || 0}</span>
            <span>·</span>
            <span>错题 {player.wrongWords?.length || 0}</span>
            <span>·</span>
            <span>收藏 {player.favoriteWords?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Tab 栏 */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-violet-400' : ''}`} />
              {tab.label}
              <span className={`text-xs ${activeTab === tab.id ? 'text-violet-400' : 'text-gray-600'}`}>
                ({tab.count})
              </span>
            </button>
          );
        })}
      </div>

      {/* 搜索和排序 */}
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
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-violet-500/50 appearance-none cursor-pointer"
        >
          <option value="default">默认排序</option>
          <option value="mastery-asc">掌握度 ↑</option>
          <option value="mastery-desc">掌握度 ↓</option>
        </select>
      </div>

      {/* 单词列表 */}
      <div className="space-y-3">
        {wordList.map((word) => {
          const mastery = getMasteryLevel(word.id);
          const isFavorite = player.favoriteWords?.includes(word.id);
          const isWrong = player.wrongWords?.includes(word.id);
          const masteryData = player.wordMastery?.[word.id];
          const isExpanded = expandedWord === word.id;

          return (
            <div
              key={word.id}
              className={`glass-card rounded-xl p-4 transition-all ${
                isExpanded ? 'border-violet-500/30' : 'hover:border-violet-500/20'
              }`}
              onClick={() => setExpandedWord(isExpanded ? null : word.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">{word.word}</h3>
                    <button
                      onClick={(e) => { e.stopPropagation(); speakWord(word.word); }}
                      className="p-1 rounded text-gray-500 hover:text-white transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
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
                  <p className="text-gray-300">{word.meaning}</p>
                </div>
                <div className="flex items-center gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
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
                      title="标记为已掌握"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* 展开详情 */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-white/5 space-y-2" onClick={(e) => e.stopPropagation()}>
                  <p className="text-sm text-gray-500 italic">{word.example}</p>
                  <p className="text-xs text-gray-600">{word.exampleTranslation}</p>

                  {masteryData && (
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      {typeof masteryData === 'object' && (
                        <>
                          <span>掌握等级: <span className="text-violet-400">{masteryData.level}/5</span></span>
                          <span>复习次数: <span className="text-violet-400">{masteryData.reviewCount}</span></span>
                          {masteryData.nextReview && (
                            <span>下次复习: <span className="text-violet-400">
                              {new Date(masteryData.nextReview).toLocaleDateString()}
                            </span></span>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {word.tags && (
                    <div className="flex gap-2 mt-2">
                      {word.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {wordList.length === 0 && (
          <div className="glass-card rounded-xl p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">
              {searchQuery ? '没有找到匹配的单词' : '暂无单词记录'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {searchQuery ? '尝试其他搜索词' : (
                activeTab === 'wrong' ? '太棒了，没有错题！' :
                activeTab === 'favorite' ? '收藏你想要重点记忆的单词吧！' :
                '去学习模式中学习新单词吧！'
              )}
            </p>
            {activeTab === 'all' && !searchQuery && (
              <button
                onClick={() => navigate('/learn')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold hover:shadow-lg transition-all"
              >
                开始学习
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WordBookPage;
