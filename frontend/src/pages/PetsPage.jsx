import { Cat, Lock, Check, Heart, Zap, Trophy } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { pets } from '../data/gameData';

const PetsPage = () => {
  const { player, unlockPet, setActivePet } = useGame();

  const handleUnlock = (petId) => {
    const pet = pets.find(p => p.id === petId);
    if (player.gold < pet.price) {
      alert('金币不足！');
      return;
    }
    unlockPet(petId);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gradient font-display mb-6 flex items-center gap-2">
        <Cat className="w-6 h-6 text-violet-400" />
        宠物伙伴
      </h1>

      {/* 当前宠物 */}
      {player.activePet && (
        <div className="glass-card rounded-2xl p-6 mb-6 border-violet-500/30">
          <h2 className="text-lg font-bold text-white mb-4">当前出战</h2>
          {(() => {
            const pet = pets.find(p => p.id === player.activePet);
            if (!pet) return null;
            return (
              <div className="flex items-center gap-4">
                <div className="text-6xl">{pet.icon}</div>
                <div>
                  <div className="text-xl font-bold text-white">{pet.name}</div>
                  <div className="text-sm text-gray-400">{pet.description}</div>
                  <div className="flex items-center gap-4 mt-2">
                    {pet.attackBonus && (
                      <span className="text-sm text-red-400">攻击 +{pet.attackBonus}</span>
                    )}
                    {pet.expBonus && (
                      <span className="text-sm text-blue-400">经验 +{Math.round(pet.expBonus * 100)}%</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 宠物列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.map((pet) => {
          const isUnlocked = player.pets?.includes(pet.id);
          const isActive = player.activePet === pet.id;
          const canUnlock = player.level >= pet.unlockLevel;

          return (
            <div
              key={pet.id}
              className={`glass-card rounded-2xl p-5 transition-all ${
                isActive
                  ? 'border-violet-500/50 bg-violet-500/5'
                  : isUnlocked
                  ? 'border-green-500/30'
                  : canUnlock
                  ? 'border-white/10'
                  : 'border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{pet.icon}</div>
                <div>
                  {isUnlocked ? (
                    <span className="text-xs font-bold text-green-400 px-2 py-1 rounded-full bg-green-500/20">
                      已拥有
                    </span>
                  ) : (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      <span className="text-xs font-bold text-amber-300">{pet.price}</span>
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{pet.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{pet.description}</p>

              <div className="space-y-1 mb-4">
                {pet.attackBonus && (
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-red-400" />
                    <span className="text-gray-300">攻击 +{pet.attackBonus}</span>
                  </div>
                )}
                {pet.expBonus && (
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">经验 +{Math.round(pet.expBonus * 100)}%</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500 mb-3">
                解锁等级: Lv.{pet.unlockLevel}
              </div>

              {isUnlocked && (
                <button
                  onClick={() => setActivePet(pet.id)}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                      : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-lg hover:shadow-violet-500/30 btn-hover'
                  }`}
                >
                  {isActive ? '出战中' : '设为出战'}
                </button>
              )}

              {!isUnlocked && canUnlock && (
                <button
                  onClick={() => handleUnlock(pet.id)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-violet-500/30 btn-hover transition-all"
                >
                  解锁 ({pet.price} 金币)
                </button>
              )}

              {!isUnlocked && !canUnlock && (
                <div className="w-full py-2.5 rounded-xl bg-white/5 text-gray-500 text-sm font-bold text-center flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Lv.{pet.unlockLevel} 解锁
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PetsPage;
