import { useState } from 'react';
import {
  User, Star, Trophy, Heart, Zap, Award, BookOpen,
  Target, Flame, Clock, Layers, Shield, Cat, Settings,
  RotateCcw, AlertTriangle
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { playerClasses, achievements } from '../data/gameData';

const ProfilePage = () => {
  const { player, resetGame, checkAchievements } = useGame();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const newAchievements = checkAchievements();

  const stats = [
    { label: '等级', value: player.level, icon: Star, color: 'text-violet-400' },
    { label: '金币', value: player.gold, icon: Trophy, color: 'text-amber-400' },
    { label: '生命值', value: `${player.currentHp}/${player.maxHp}`, icon: Heart, color: 'text-red-400' },
    { label: '攻击力', value: player.attack, icon: Zap, color: 'text-orange-400' },
    { label: '防御力', value: player.defense, icon: Shield, color: 'text-blue-400' },
    { label: '卡牌数', value: player.totalCards, icon: Layers, color: 'text-purple-400' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gradient font-display mb-6 flex items-center gap-2">
        <User className="w-6 h-6 text-violet-400" />
        个人资料
      </h1>

      {/* 玩家信息 */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-amber-500 flex items-center justify-center text-4xl shadow-lg shadow-violet-500/30">
            🎮
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{player.name}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Lv.{player.level}</span>
              <span>·</span>
              <span>{playerClasses.find(c => c.id === player.class)?.name || '学者'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center p-3 bg-white/5 rounded-xl">
                <Icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-[10px] text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 成就 */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          成就
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {achievements.map((achievement) => {
            const unlocked = player.achievements?.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`p-3 rounded-xl text-center transition-all ${
                  unlocked
                    ? 'bg-amber-500/10 border border-amber-500/30'
                    : 'bg-white/5 border border-white/5 opacity-50'
                }`}
              >
                <div className="text-2xl mb-1">{achievement.icon}</div>
                <div className={`text-xs font-bold ${unlocked ? 'text-amber-400' : 'text-gray-500'}`}>
                  {achievement.name}
                </div>
                <div className="text-[10px] text-gray-500">{achievement.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 设置 */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-400" />
          设置
        </h3>
        <div className="space-y-3">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="font-medium">重置游戏</span>
          </button>
        </div>
      </div>

      {/* 重置确认 */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <h3 className="text-lg font-bold text-white">确认重置?</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              这将清除所有游戏进度，包括等级、金币、卡牌等。此操作不可撤销！
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 transition-all"
              >
                取消
              </button>
              <button
                onClick={() => {
                  resetGame();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-all"
              >
                确认重置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
