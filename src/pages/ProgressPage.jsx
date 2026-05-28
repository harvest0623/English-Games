import { useState } from 'react';
import { TrendingUp, Target, Clock, BookOpen, AlertCircle, RotateCcw, Trash2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { words } from '../data/words';

const ProgressPage = () => {
  const { progress, clearWrongWords } = useGame();
  const [activeTab, setActiveTab] = useState('overview');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const accuracy = progress.totalGames > 0
    ? Math.round((progress.correctCount / (progress.correctCount + progress.wrongCount)) * 100)
    : 0;

  const todayAccuracy = progress.todayTotal > 0
    ? Math.round((progress.todayCorrect / progress.todayTotal) * 100)
    : 0;

  const wrongWordsList = words.filter(w => progress.wrongWords.includes(w.id));

  const handleClearWrongWords = () => {
    clearWrongWords();
    setShowClearConfirm(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 md:pb-0">
      <div className="glass rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-primary-400" />
          <span className="text-gradient">学习进度</span>
        </h1>

        <div className="flex gap-2 mb-6">
          {['overview', 'wrong'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-gradient-primary text-white'
                  : 'glass hover:bg-white/10 text-gray-400'
              }`}
            >
              {tab === 'overview' ? '总览' : `错题本 (${progress.wrongWords.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-400" />
                </div>
                <div className="font-display font-bold text-3xl text-gradient mb-1">{accuracy}%</div>
                <div className="text-sm text-gray-400">总正确率</div>
              </div>

              <div className="glass rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
                <div className="font-display font-bold text-3xl text-gradient mb-1">{progress.correctCount}</div>
                <div className="text-sm text-gray-400">答对题数</div>
              </div>

              <div className="glass rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div className="font-display font-bold text-3xl text-gradient mb-1">{progress.wrongCount}</div>
                <div className="text-sm text-gray-400">答错题数</div>
              </div>

              <div className="glass rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
                <div className="font-display font-bold text-3xl text-gradient mb-1">{progress.totalGames}</div>
                <div className="text-sm text-gray-400">学习轮次</div>
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">今日数据</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-4 bg-dark-800 rounded-lg">
                  <span className="text-gray-400">今日正确率</span>
                  <span className="font-display font-bold text-xl text-green-400">{todayAccuracy}%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-dark-800 rounded-lg">
                  <span className="text-gray-400">今日答题</span>
                  <span className="font-display font-bold text-xl text-blue-400">{progress.todayTotal}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-dark-800 rounded-lg">
                  <span className="text-gray-400">最高连击</span>
                  <span className="font-display font-bold text-xl text-purple-400">{progress.maxCombo}</span>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">学习连续性</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>连续学习</span>
                    <span className="font-display font-bold text-xl text-gradient">{progress.streakDays} 天</span>
                  </div>
                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-primary rounded-full"
                      style={{ width: `${Math.min((progress.streakDays / 30) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">目标: 30天</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wrong' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">易错单词 ({wrongWordsList.length})</h3>
              {wrongWordsList.length > 0 && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-red-500/20 transition-colors text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>清空错题本</span>
                </button>
              )}
            </div>

            {wrongWordsList.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-bold mb-2">太棒了！</h3>
                <p className="text-gray-400">你没有错题，保持下去！</p>
              </div>
            ) : (
              <div className="space-y-3">
                {wrongWordsList.map((word) => (
                  <div key={word.id} className="glass rounded-xl p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl font-word font-bold">{word.word}</span>
                        <span className="text-sm text-gray-400">{word.phonetic}</span>
                      </div>
                      <div className="text-gray-400">{word.meaning}</div>
                    </div>
                    <button className="px-4 py-2 bg-gradient-primary rounded-lg font-medium btn-hover flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      <span>复习</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-strong rounded-2xl p-8 max-w-md w-full animate-bounce-in">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">确认清空错题本？</h3>
              <p className="text-gray-400 mb-6">
                这将清除所有记录的错题，此操作无法撤销。
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-6 py-3 glass rounded-xl font-bold btn-hover"
                >
                  取消
                </button>
                <button
                  onClick={handleClearWrongWords}
                  className="flex-1 px-6 py-3 bg-red-500 rounded-xl font-bold btn-hover"
                >
                  确认清空
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressPage;
