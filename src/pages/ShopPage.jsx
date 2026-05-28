import { useState } from 'react';
import { ShoppingBag, Trophy, Heart, Zap, Shield, Sword, Sparkles, Check, X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { shopItems, equipment } from '../data/gameData';

const ShopPage = () => {
  const { player, buyItem, buyEquipment, useItem } = useGame();
  const [activeTab, setActiveTab] = useState('items');
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2000);
  };

  const handleBuyItem = (item) => {
    if (player.gold < item.price) {
      showNotification('金币不足！', 'error');
      return;
    }
    const success = buyItem(item);
    if (success) {
      showNotification(`购买成功：${item.name}`);
    }
  };

  const handleBuyEquipment = (equip) => {
    if (player.gold < equip.price) {
      showNotification('金币不足！', 'error');
      return;
    }
    const success = buyEquipment(equip);
    if (success) {
      showNotification(`购买成功：${equip.name}`);
    }
  };

  const getRarityColor = (rarity) => {
    const colors = { N: 'gray', R: 'blue', SR: 'purple', SSR: 'amber' };
    return colors[rarity] || 'gray';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gradient font-display flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-violet-400" />
          冒险商店
        </h1>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-bold text-amber-300">{player.gold} 金币</span>
        </div>
      </div>

      {/* 标签页 */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'items', label: '道具', icon: Zap },
          { id: 'equipment', label: '装备', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 道具商店 */}
      {activeTab === 'items' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shopItems.map((item) => (
            <div key={item.id} className="glass-card rounded-2xl p-5 hover:border-violet-500/30 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{item.icon}</div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300">{item.price}</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{item.description}</p>
              <button
                onClick={() => handleBuyItem(item)}
                disabled={player.gold < item.price}
                className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
                  player.gold >= item.price
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-lg hover:shadow-violet-500/30 btn-hover'
                    : 'bg-white/5 text-gray-500 cursor-not-allowed'
                }`}
              >
                {player.gold >= item.price ? '购买' : '金币不足'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 装备商店 */}
      {activeTab === 'equipment' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipment.map((equip) => {
            const rarityColor = getRarityColor(equip.rarity);
            const isOwned = player.equipment[equip.slot]?.id === equip.id;
            return (
              <div key={equip.id} className={`glass-card rounded-2xl p-5 hover:border-${rarityColor}-500/30 transition-all ${isOwned ? 'border-green-500/30' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{equip.icon}</div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded bg-${rarityColor}-500/20 text-${rarityColor}-400`}>
                      {equip.rarity}
                    </span>
                    {!isOwned && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                        <Trophy className="w-3 h-3 text-amber-400" />
                        <span className="text-xs font-bold text-amber-300">{equip.price}</span>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{equip.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{equip.description}</p>
                <div className="space-y-1 mb-4">
                  {equip.attackBonus && (
                    <div className="flex items-center gap-2 text-sm">
                      <Sword className="w-4 h-4 text-red-400" />
                      <span className="text-gray-300">攻击 +{equip.attackBonus}</span>
                    </div>
                  )}
                  {equip.defenseBonus && (
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">防御 +{equip.defenseBonus}</span>
                    </div>
                  )}
                </div>
                {isOwned ? (
                  <div className="w-full py-2.5 rounded-xl bg-green-500/20 text-green-400 text-sm font-bold text-center flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    已装备
                  </div>
                ) : (
                  <button
                    onClick={() => handleBuyEquipment(equip)}
                    disabled={player.gold < equip.price}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
                      player.gold >= equip.price
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-lg hover:shadow-violet-500/30 btn-hover'
                        : 'bg-white/5 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {player.gold >= equip.price ? '购买' : '金币不足'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 通知 */}
      {notification && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
          <div className={`px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
            notification.type === 'error' ? 'bg-red-500/90 text-white' : 'bg-green-500/90 text-white'
          }`}>
            {notification.type === 'error' ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            {notification.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
