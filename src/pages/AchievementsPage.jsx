import { useState, useEffect } from 'react';
import { Award, Star, Flame, Trophy, Crown, Target, BookOpen, Zap, Rocket } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { achievements } from '../data/words';

const AchievementsPage = () => {
  const { progress } = useGame();
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  const achievementIcons = {
    Star: Star,
    Flame: Flame,
    Trophy: Trophy,
    Crown: Crown,
    Target: Target,
    BookOpen: BookOpen,
    Award: Award,
    Zap: Zap,
    Rocket: Rocket
  };

  const achievementColors = {
    first_learn: 'from-yellow-500 to-orange-500',
    streak_3: 'from-red-500 to-pink-500',
    streak_7: 'from-purple-500 to-indigo-500',
    streak_30: 'from-yellow-400 to-amber-500',
    perfect_10: 'from-cyan-500 to-blue-500',
    words_100: 'from-green-500 to-emerald-500',
    words_500: 'from-blue-500 to-violet-500',
    words_1000: 'from-violet-500 to-purple-500',
    combo_5: 'from-orange-500 to-yellow-500',
    combo_10: 'from-pink-500 to-rose-500'
  };

  useEffect(() => {
    const stats = {
      totalLearned: progress.correctCount,
      streakDays: progress.streakDays,
      totalGames: progress.totalGames,
      perfectRounds: progress.perfectRounds,
      maxCombo: progress.maxCombo
    };

    const unlocked = achievements.filter(achievement => 
      progress.achievements.includes(achievement.id) || achievement.condition(stats)
    );

    setUnlockedAchievements(unlocked.map(a => a.id));
  }, [progress]);

  const handleUnlock = (achievement) => {
    if (!progress.achievements.includes(achievement.id)) {
      const newProgress = { ...progress };
      newProgress.achievements.push(achievement.id);
      localStorage.setItem('wordGameProgress', JSON.stringify(newProgress));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 md:pb-0">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Award className="w-7 h-7 text-primary-400" />
            <span className="text-gradient">成就系统</span>
          </h1>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-primary">
            <Star className="w-5 h-5 text-white" />
            <span className="font-display font-bold">{unlockedAchievements.length}</span>
            <span className="text-white/80">/ {achievements.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievementIcons[achievement.icon] || Star;
            const isUnlocked = progress.achievements.includes(achievement.id);
            const colorClass = achievementColors[achievement.id] || 'from-gray-500 to-gray-600';

            return (
              <div
                key={achievement.id}
                className={`relative glass rounded-xl p-6 transition-all ${
                  isUnlocked 
                    ? 'border-2 border-primary-500/50' 
                    : 'opacity-60'
                }`}
              >
                {isUnlocked && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center ${
                  isUnlocked ? 'animate-pulse-glow' : 'grayscale'
                }`}>
                  <Icon className={`w-8 h-8 text-white ${!isUnlocked ? 'opacity-50' : ''}`} />
                </div>

                <div className="text-center">
                  <h3 className={`text-lg font-bold mb-1 ${isUnlocked ? 'text-gradient' : 'text-gray-400'}`}>
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {achievement.description}
                  </p>
                  {!isUnlocked && (
                    <button
                      onClick={() => handleUnlock(achievement)}
                      className="px-4 py-1.5 bg-gradient-primary rounded-lg text-sm font-medium btn-hover"
                    >
                      解锁
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 glass rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">解锁进度</h3>
          <div className="h-3 bg-dark-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-primary rounded-full transition-all duration-500"
              style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400 mt-2 text-center">
            {unlockedAchievements.length} / {achievements.length} 成就已解锁
          </p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <span>成就说明</span>
        </h2>
        <div className="space-y-3 text-sm text-gray-400">
          <p>🎯 <strong className="text-white">初出茅庐</strong> - 完成第一次学习即可解锁</p>
          <p>🔥 <strong className="text-white">三天打鱼</strong> - 连续学习3天即可解锁</p>
          <p>💪 <strong className="text-white">一周坚持</strong> - 连续学习7天即可解锁</p>
          <p>👑 <strong className="text-white">月度达人</strong> - 连续学习30天即可解锁</p>
          <p>🎯 <strong className="text-white">满分选手</strong> - 单轮10题全对即可解锁</p>
          <p>📚 <strong className="text-white">词汇百例</strong> - 累计答对100题即可解锁</p>
          <p>🏆 <strong className="text-white">词汇五百</strong> - 累计答对500题即可解锁</p>
          <p>🌈 <strong className="text-white">词汇千例</strong> - 累计答对1000题即可解锁</p>
          <p>⚡ <strong className="text-white">五连绝世</strong> - 连续答对5题即可解锁</p>
          <p>🚀 <strong className="text-white">十连绝伦</strong> - 连续答对10题即可解锁</p>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;
