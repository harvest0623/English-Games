import { Medal, Crown, Trophy, Star, TrendingUp } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { leaderboardData } from '../data/gameData';

const LeaderboardPage = () => {
  const { player } = useGame();

  // 将玩家插入排行榜
  const allPlayers = [...leaderboardData];
  const playerIndex = allPlayers.findIndex(p => p.name === player.name);
  if (playerIndex === -1) {
    allPlayers.push({
      rank: 0,
      name: player.name,
      level: player.level,
      rankPoints: player.rankPoints,
      avatar: '🎮',
      isPlayer: true
    });
  } else {
    allPlayers[playerIndex] = { ...allPlayers[playerIndex], isPlayer: true };
  }

  // 排序
  allPlayers.sort((a, b) => b.rankPoints - a.rankPoints);
  allPlayers.forEach((p, i) => { p.rank = i + 1; });

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      case 2: return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
      case 3: return 'bg-gradient-to-r from-orange-600/20 to-amber-700/20 border-orange-600/30';
      default: return 'bg-white/5 border-white/5';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-orange-400" />;
      default: return <span className="text-sm font-bold text-gray-500 w-5 text-center">{rank}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gradient font-display mb-6 flex items-center gap-2">
        <Medal className="w-6 h-6 text-amber-400" />
        排行榜
      </h1>

      {/* 玩家自己的排名 */}
      <div className="glass-card rounded-2xl p-6 mb-6 border-violet-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-2xl">
              🎮
            </div>
            <div>
              <div className="font-bold text-white text-lg">{player.name}</div>
              <div className="text-sm text-gray-400">Lv.{player.level} · {player.rankPoints} 积分</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gradient-gold">
              #{allPlayers.find(p => p.isPlayer)?.rank || '-'}
            </div>
            <div className="text-xs text-gray-400">当前排名</div>
          </div>
        </div>
      </div>

      {/* 排行榜列表 */}
      <div className="space-y-2">
        {allPlayers.slice(0, 15).map((p) => (
          <div
            key={p.name}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
              p.isPlayer
                ? 'bg-violet-500/10 border-violet-500/30'
                : getRankStyle(p.rank)
            }`}
          >
            <div className="w-8 flex justify-center">
              {getRankIcon(p.rank)}
            </div>
            <div className="text-2xl">{p.avatar}</div>
            <div className="flex-1">
              <div className={`font-medium ${p.isPlayer ? 'text-violet-300' : 'text-white'}`}>
                {p.name} {p.isPlayer && '(你)'}
              </div>
              <div className="text-xs text-gray-400">Lv.{p.level}</div>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-amber-400">{p.rankPoints}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
