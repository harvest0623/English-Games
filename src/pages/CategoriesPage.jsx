import { Grid3X3, BookOpen, Star, ChevronRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { wordCategories } from '../data/gameData';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const { player, selectCategory } = useGame();

  const handleSelect = (categoryId) => {
    selectCategory(categoryId);
    navigate('/');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '简单': return 'text-green-400 bg-green-500/20';
      case '中等': return 'text-yellow-400 bg-yellow-500/20';
      case '较难': return 'text-orange-400 bg-orange-500/20';
      case '困难': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gradient font-display mb-6 flex items-center gap-2">
        <Grid3X3 className="w-6 h-6 text-violet-400" />
        词库分类
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wordCategories.map((category) => {
          const isSelected = player.selectedCategory === category.id;

          return (
            <div
              key={category.id}
              onClick={() => handleSelect(category.id)}
              className={`glass-card rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1 ${
                isSelected
                  ? 'border-violet-500/50 bg-violet-500/5'
                  : 'border-white/10 hover:border-violet-500/30'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{category.icon}</div>
                {isSelected && (
                  <span className="text-xs font-bold text-violet-400 px-2 py-1 rounded-full bg-violet-500/20">
                    当前选择
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{category.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{category.description}</p>

              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(category.difficulty)}`}>
                  {category.difficulty}
                </span>
                <span className="text-xs text-gray-500">{category.wordCount} 词</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <BookOpen className="w-4 h-4" />
                  <span>{category.wordCount} 词汇</span>
                </div>
                <ChevronRight className={`w-5 h-5 transition-all ${
                  isSelected ? 'text-violet-400' : 'text-gray-600'
                }`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesPage;
