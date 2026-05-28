import { Zap, Lock, Check, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { skillTree } from '../data/gameData';

const SkillsPage = () => {
  const { player, unlockSkill } = useGame();

  const handleUnlock = (skillId) => {
    unlockSkill(skillId);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gradient font-display mb-6 flex items-center gap-2">
        <Zap className="w-6 h-6 text-violet-400" />
        技能树
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillTree.map((skill) => {
          const isUnlocked = player.unlockedSkills?.includes(skill.id);
          const canUnlock = player.level >= skill.requiredLevel && !isUnlocked;

          return (
            <div
              key={skill.id}
              className={`glass-card rounded-2xl p-5 transition-all ${
                isUnlocked
                  ? 'border-green-500/30 bg-green-500/5'
                  : canUnlock
                  ? 'border-violet-500/30 hover:border-violet-500/50'
                  : 'border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{skill.icon}</div>
                <div className="flex items-center gap-2">
                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-green-400 px-2 py-1 rounded-full bg-green-500/20">
                      <Check className="w-3 h-3" />
                      已解锁
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-gray-400 px-2 py-1 rounded-full bg-white/5">
                      <Lock className="w-3 h-3" />
                      Lv.{skill.requiredLevel}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{skill.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{skill.description}</p>

              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  skill.type === 'active'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {skill.type === 'active' ? '主动技能' : '被动技能'}
                </span>
              </div>

              {canUnlock && (
                <button
                  onClick={() => handleUnlock(skill.id)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-violet-500/30 btn-hover transition-all"
                >
                  解锁技能
                </button>
              )}

              {isUnlocked && (
                <div className="w-full py-2.5 rounded-xl bg-green-500/20 text-green-400 text-sm font-bold text-center">
                  已掌握
                </div>
              )}

              {!canUnlock && !isUnlocked && (
                <div className="w-full py-2.5 rounded-xl bg-white/5 text-gray-500 text-sm font-bold text-center">
                  需要等级 {skill.requiredLevel}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillsPage;
