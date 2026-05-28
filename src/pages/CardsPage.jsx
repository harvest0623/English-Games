import { useState } from 'react';
import { Layers, Star, Filter, Search, X } from 'lucide-react';
import { useGame } from '../context/GameContext';

const CardsPage = () => {
  const { player } = useGame();
  const [filterRarity, setFilterRarity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCards = player.cards.filter(card => {
    if (filterRarity !== 'all' && card.rarity !== filterRarity) return false;
    if (searchQuery && !card.word.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const rarityColors = {
    N: { bg: 'bg-gray-500/20', border: 'border-gray-500/30', text: 'text-gray-400' },
    R: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
    SR: { bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-400' },
    SSR: { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400' }
  };

  const rarityStats = {
    N: player.cards.filter(c => c.rarity === 'N').length,
    R: player.cards.filter(c => c.rarity === 'R').length,
    SR: player.cards.filter(c => c.rarity === 'SR').length,
    SSR: player.cards.filter(c => c.rarity === 'SSR').length
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gradient font-display flex items-center gap-2">
          <Layers className="w-6 h-6 text-violet-400" />
          卡牌收集
        </h1>
        <div className="text-sm text-gray-400">
          已收集 {player.cards.length} 张
        </div>
      </div>

      {/* 稀有度统计 */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {Object.entries(rarityStats).map(([rarity, count]) => (
          <div
            key={rarity}
            onClick={() => setFilterRarity(filterRarity === rarity ? 'all' : rarity)}
            className={`glass-card rounded-xl p-3 text-center cursor-pointer transition-all ${
              filterRarity === rarity ? rarityColors[rarity].border : ''
            }`}
          >
            <div className={`text-lg font-bold ${rarityColors[rarity].text}`}>{rarity}</div>
            <div className="text-xs text-gray-400">{count} 张</div>
          </div>
        ))}
      </div>

      {/* 搜索 */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索卡牌..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
        />
      </div>

      {/* 卡牌网格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCards.map((card) => {
          const rarity = rarityColors[card.rarity];
          return (
            <div
              key={card.id}
              className={`glass-card rounded-2xl p-4 border ${rarity.border} hover:-translate-y-1 transition-all`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${rarity.bg} ${rarity.text}`}>
                  {card.rarity}
                </span>
                <span className="text-xs text-gray-500">战力 {card.power}</span>
              </div>

              <div className="text-center mb-3">
                <div className="text-4xl mb-2">📜</div>
                <div className="font-bold text-white text-sm">{card.word}</div>
                <div className="text-xs text-gray-400">{card.phonetic}</div>
              </div>

              <div className="text-center">
                <div className="text-sm text-gray-300">{card.meaning}</div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCards.length === 0 && (
        <div className="glass-card rounded-xl p-12 text-center">
          <Layers className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">
            {searchQuery || filterRarity !== 'all' ? '没有找到匹配的卡牌' : '还没有收集到卡牌'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {searchQuery || filterRarity !== 'all' ? '尝试其他筛选条件' : '去战斗中获取卡牌吧！'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CardsPage;
