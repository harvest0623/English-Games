import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, Lock, Check, Star, TrendingUp } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { wordCategories } from '../data/gameData';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const { player, selectCategory } = useGame();
  const [selectedId, setSelectedId] = useState(player.selectedCategory);

  const handleSelect = (categoryId) => {
    setSelectedId(categoryId);
    selectCategory(categoryId);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '简单': return 'text-green-400';
      case '中等': return 'text-yellow-400';
      case '较难': return 'text-orange-400';
      case '困难': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyBg = (difficulty) => {
    switch (difficulty) {
      case '简单': return 'bg-green-500/10 border-green-500/20';
      case '中等': return 'bg-yellow-500/10 border-yellow-500/20';
      case '较难': return 'bg-orange-500/10 border-orange-500/20';
      case '困难': return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* 页面标题 */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gradient font-display mb-3">
          词库分类
        </h1>
        <p className="text-gray-500">
          选择适合你的词库，开启单词冒险之旅
        </p>
      </div>

      {/* 分类卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {wordCategories.map((category) => {
          const isSelected = selectedId === category.id;
          const isLocked = player.level < (category.id === 'cet4' ? 1 :
            category.id === 'cet6' ? 3 :
            category.id === 'ielts' ? 5 :
            category.id === 'toefl' ? 7 :
            category.id === 'business' ? 2 : 1);

          return (
            <div
              key={category.id}
              onClick={() => !isLocked && handleSelect(category.id)}
              className={`relative glass-card rounded-2xl p-6 transition-all duration-300 ${
                isLocked
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10'
              } ${
                isSelected
                  ? 'border-violet-500/50 bg-violet-500/5'
                  : 'border-white/10'
              }`}
            >
              {/* 选中标记 */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              {/* 锁定标记 */}
              {isLocked && (
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
              )}

              {/* 图标 */}
              <div className="text-5xl mb-4">{category.icon}</div>

              {/* 名称 */}
              <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>

              {/* 描述 */}
              <p className="text-sm text-gray-500 mb-4">{category.description}</p>

              {/* 信息标签 */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-xs px-2.5 py-1 rounded-full border ${getDifficultyBg(category.difficulty)} ${getDifficultyColor(category.difficulty)}`}>
                  {category.difficulty}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10">
                  {category.wordCount} 词
                </span>
              </div>

              {/* 进度条（仅已解锁） */}
              {!isLocked && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">学习进度</span>
                    <span className="text-violet-400">
                      {Math.floor(Math.random() * 30)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600"
                      style={{ width: `${Math.floor(Math.random() * 30)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* 解锁提示 */}
              {isLocked && (
                <p className="text-xs text-gray-600 mt-2">
                  需要等级 {category.id === 'cet4' ? 1 :
                    category.id === 'cet6' ? 3 :
                    category.id === 'ielts' ? 5 :
                    category.id === 'toefl' ? 7 :
                    category.id === 'business' ? 2 : 1} 解锁
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* 选中提示 */}
      {selectedId && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <BookOpen className="w-5 h-5 text-violet-400" />
            <span className="text-sm text-violet-300">
              已选择：{wordCategories.find(c => c.id === selectedId)?.name}
            </span>
            <button
              onClick={() => navigate('/')}
              className="ml-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all"
            >
              开始冒险
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
