import { TrendingUp, Target, Clock, BookOpen, Flame, Award, Zap, BarChart3 } from 'lucide-react';
import { useGame } from '../context/GameContext';

const StatsPage = () => {
  const { player } = useGame();
  const stats = player.studyStats || {};
  const totalAnswers = (stats.totalCorrect || 0) + (stats.totalWrong || 0);
  const accuracy = totalAnswers > 0 ? Math.round((stats.totalCorrect / totalAnswers) * 100) : 0;
  const todayAccuracy = (stats.todayCorrect + stats.todayWrong) > 0
    ? Math.round((stats.todayCorrect / (stats.todayCorrect + stats.todayWrong)) * 100)
    : 0;

  const statCards = [
    {
      title: '总学习时长',
      value: `${Math.floor((stats.totalStudyTime || 0) / 60)}`,
      unit: '分钟',
      icon: Clock,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      title: '已学单词',
      value: player.learnedWords?.length || 0,
      unit: '个',
      icon: BookOpen,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20'
    },
    {
      title: '总正确率',
      value: accuracy,
      unit: '%',
      icon: Target,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      title: '今日正确',
      value: stats.todayCorrect || 0,
      unit: '题',
      icon: Zap,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    },
    {
      title: '连胜天数',
      value: player.dailyCheckIn?.streak || 0,
      unit: '天',
      icon: Flame,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20'
    },
    {
      title: '战斗次数',
      value: player.totalBattles || 0,
      unit: '场',
      icon: Award,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gradient font-display mb-6 flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-violet-400" />
        学习统计
      </h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className={`glass-card rounded-2xl p-5 border ${card.border}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <span className="text-sm text-gray-400">{card.title}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{card.value}</span>
                <span className="text-sm text-gray-500">{card.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 今日学习情况 */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          今日学习情况
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">正确率</span>
              <span className="text-sm font-bold text-emerald-400">{todayAccuracy}%</span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all"
                style={{ width: `${todayAccuracy}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">答题数</span>
              <span className="text-sm font-bold text-violet-400">{stats.todayCorrect + stats.todayWrong}</span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-400 rounded-full transition-all"
                style={{ width: `${Math.min(100, ((stats.todayCorrect + stats.todayWrong) / 50) * 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">学习时长</span>
              <span className="text-sm font-bold text-amber-400">{Math.floor((stats.todayStudyTime || 0) / 60)}分钟</span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all"
                style={{ width: `${Math.min(100, ((stats.todayStudyTime || 0) / 1800) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 成就进度 */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          成就进度
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-violet-400 mb-1">{player.level}</div>
            <div className="text-xs text-gray-400">当前等级</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-emerald-400 mb-1">{player.completedLevels?.length || 0}</div>
            <div className="text-xs text-gray-400">通关关卡</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-red-400 mb-1">{player.defeatedBosses?.length || 0}</div>
            <div className="text-xs text-gray-400">击败BOSS</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-amber-400 mb-1">{player.totalCards || 0}</div>
            <div className="text-xs text-gray-400">收集卡牌</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
