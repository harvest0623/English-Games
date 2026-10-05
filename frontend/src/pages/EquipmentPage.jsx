import { Shield, Sword, Check, X } from 'lucide-react';
import { useGame } from '../context/GameContext';

const EquipmentPage = () => {
  const { player } = useGame();

  const slots = [
    { key: 'weapon', name: '武器', icon: Sword, defaultIcon: '⚔️' },
    { key: 'armor', name: '防具', icon: Shield, defaultIcon: '🛡️' },
    { key: 'accessory', name: '饰品', icon: Shield, defaultIcon: '💍' },
  ];

  const getTotalStats = () => {
    let attack = player.attack;
    let defense = player.defense;

    if (player.equipment.weapon?.attackBonus) attack += player.equipment.weapon.attackBonus;
    if (player.equipment.armor?.defenseBonus) defense += player.equipment.armor.defenseBonus;
    if (player.equipment.accessory?.attackBonus) attack += player.equipment.accessory.attackBonus;
    if (player.equipment.accessory?.defenseBonus) defense += player.equipment.accessory.defenseBonus;

    return { attack, defense };
  };

  const totalStats = getTotalStats();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gradient font-display mb-6 flex items-center gap-2">
        <Shield className="w-6 h-6 text-violet-400" />
        装备管理
      </h1>

      {/* 属性总览 */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">当前属性</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-red-400 mb-1">{totalStats.attack}</div>
            <div className="text-xs text-gray-400">总攻击</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-blue-400 mb-1">{totalStats.defense}</div>
            <div className="text-xs text-gray-400">总防御</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-green-400 mb-1">{player.maxHp}</div>
            <div className="text-xs text-gray-400">最大生命</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-violet-400 mb-1">{player.currentHp}</div>
            <div className="text-xs text-gray-400">当前生命</div>
          </div>
        </div>
      </div>

      {/* 装备槽 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {slots.map((slot) => {
          const equipped = player.equipment[slot.key];

          return (
            <div key={slot.key} className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <slot.icon className="w-5 h-5 text-violet-400" />
                <h3 className="font-bold text-white">{slot.name}</h3>
              </div>

              {equipped ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center h-24 bg-white/5 rounded-xl">
                    <span className="text-5xl">{equipped.icon}</span>
                  </div>
                  <div>
                    <div className="font-bold text-white">{equipped.name}</div>
                    <div className="text-sm text-gray-400">{equipped.description}</div>
                  </div>
                  <div className="space-y-1">
                    {equipped.attackBonus && (
                      <div className="flex items-center gap-2 text-sm">
                        <Sword className="w-4 h-4 text-red-400" />
                        <span className="text-gray-300">攻击 +{equipped.attackBonus}</span>
                      </div>
                    )}
                    {equipped.defenseBonus && (
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-300">防御 +{equipped.defenseBonus}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <Check className="w-4 h-4" />
                    已装备
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3 opacity-30">{slot.defaultIcon}</div>
                  <p className="text-gray-500 text-sm">未装备{slot.name}</p>
                  <p className="text-xs text-gray-600 mt-1">前往商店购买</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EquipmentPage;
