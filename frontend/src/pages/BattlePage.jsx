import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Swords, Heart, Shield, Zap, Trophy, Star, Sparkles,
  ArrowRight, RotateCcw, Home, Flame
} from 'lucide-react';
import { useGame } from '../context/GameContext';

const BattlePage = () => {
  const navigate = useNavigate();
  const {
    player,
    battleState,
    currentLevel,
    startBattle,
    submitAnswer,
    nextQuestion,
    collectCards,
    skipCards,
    cardRewards
  } = useGame();

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCombo, setShowCombo] = useState(false);

  useEffect(() => {
    if (!battleState.isInBattle && !battleState.isVictory && !battleState.isDefeat) {
      navigate('/');
    }
  }, [battleState.isInBattle, battleState.isVictory, battleState.isDefeat, navigate]);

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null || showResult) return;

    setSelectedAnswer(answer);
    const correct = submitAnswer(answer);
    setIsCorrect(correct);
    setShowResult(true);

    if (correct && battleState.combo + 1 >= 3) {
      setShowCombo(true);
      setTimeout(() => setShowCombo(false), 1500);
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setShowResult(false);
      nextQuestion();
    }, 1200);
  };

  const currentQuestion = battleState.questions[battleState.currentIndex];
  const hpPercent = (player.currentHp / player.maxHp) * 100;
  const enemyHpPercent = battleState.enemy
    ? (battleState.enemy.hp / battleState.enemy.maxHp) * 100
    : 0;

  // 战斗进行中
  if (battleState.isInBattle && currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* 战斗状态栏 */}
        <div className="glass-card rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-xl">
                ⚔️
              </div>
              <div>
                <div className="font-bold text-white">{player.name}</div>
                <div className="text-xs text-gray-400">Lv.{player.level}</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gradient-gold font-display">
                {battleState.combo > 0 ? `${battleState.combo}x` : 'VS'}
              </div>
              {battleState.combo > 0 && (
                <div className="text-xs text-orange-400">连击!</div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-bold text-white">{battleState.enemy?.name}</div>
                <div className="text-xs text-gray-400">{currentLevel?.name}</div>
              </div>
              <div className="text-4xl">{battleState.enemy?.image}</div>
            </div>
          </div>

          {/* 血条 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-400">HP</span>
                <span className="text-red-400">{player.currentHp}/{player.maxHp}</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-500"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-400">HP</span>
                <span className="text-red-400">{battleState.enemy?.hp}/{battleState.enemy?.maxHp}</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${enemyHpPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 题目区域 */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="text-center mb-6">
            <div className="text-sm text-gray-400 mb-2">
              题目 {battleState.currentIndex + 1} / {battleState.questions.length}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{currentQuestion.word}</h2>
            <p className="text-gray-400">{currentQuestion.phonetic}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrectAnswer = option === currentQuestion.correctAnswer;
              const showCorrect = showResult && isCorrectAnswer;
              const showWrong = showResult && isSelected && !isCorrectAnswer;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={`p-4 rounded-xl text-left transition-all duration-300 ${
                    showCorrect
                      ? 'bg-green-500/20 border-2 border-green-500/50 correct-animation'
                      : showWrong
                      ? 'bg-red-500/20 border-2 border-red-500/50 wrong-animation'
                      : isSelected
                      ? 'bg-violet-500/20 border-2 border-violet-500/50'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      showCorrect
                        ? 'bg-green-500/30 text-green-400'
                        : showWrong
                        ? 'bg-red-500/30 text-red-400'
                        : 'bg-white/10 text-gray-400'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-white">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 连击提示 */}
        {showCombo && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
            <div className="text-6xl font-bold text-gradient-gold animate-bounce font-display">
              {battleState.combo}x 连击!
            </div>
          </div>
        )}
      </div>
    );
  }

  // 胜利画面
  if (battleState.isVictory) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="glass-card rounded-2xl p-8 mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gradient mb-2 font-display">胜利!</h2>
          <p className="text-gray-400 mb-6">你成功击败了 {battleState.enemy?.name}!</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4">
              <Zap className="w-6 h-6 text-violet-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{battleState.expGained}</div>
              <div className="text-xs text-gray-400">经验值</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{battleState.goldGained}</div>
              <div className="text-xs text-gray-400">金币</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{battleState.correctCount}</div>
              <div className="text-xs text-gray-400">正确数</div>
            </div>
          </div>

          {battleState.perfectBattle && (
            <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl p-3 mb-6">
              <div className="flex items-center justify-center gap-2 text-yellow-400 font-bold">
                <Sparkles className="w-5 h-5" />
                完美通关! 额外奖励!
              </div>
            </div>
          )}
        </div>

        {/* 卡牌奖励 */}
        {cardRewards.length > 0 && (
          <div className="glass-card rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">获得卡牌</h3>
            <div className="flex justify-center gap-4 mb-6">
              {cardRewards.map((card, index) => (
                <div
                  key={index}
                  className="w-32 h-44 rounded-xl flex flex-col items-center justify-center p-3 border-2"
                  style={{
                    background: `linear-gradient(135deg, ${cardRarityColor(card.rarity)}22, ${cardRarityColor(card.rarity)}11)`,
                    borderColor: `${cardRarityColor(card.rarity)}66`
                  }}
                >
                  <div className="text-2xl mb-2">📜</div>
                  <div className="text-xs font-bold text-white text-center mb-1">{card.word}</div>
                  <div className="text-[10px] text-gray-400 text-center">{card.meaning}</div>
                  <div className="mt-auto">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${cardRarityColor(card.rarity)}33`, color: cardRarityColor(card.rarity) }}
                    >
                      {card.rarity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={collectCards}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold hover:shadow-lg hover:shadow-violet-500/30 btn-hover transition-all"
              >
                收集卡牌
              </button>
              <button
                onClick={skipCards}
                className="px-6 py-3 rounded-xl bg-white/10 text-gray-400 font-bold hover:bg-white/15 transition-all"
              >
                跳过
              </button>
            </div>
          </div>
        )}

        {cardRewards.length === 0 && (
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold hover:shadow-lg hover:shadow-violet-500/30 btn-hover transition-all"
          >
            返回首页
          </button>
        )}
      </div>
    );
  }

  // 失败画面
  if (battleState.isDefeat) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="glass-card rounded-2xl p-8">
          <div className="text-6xl mb-4">💀</div>
          <h2 className="text-3xl font-bold text-red-400 mb-2 font-display">失败</h2>
          <p className="text-gray-400 mb-6">{battleState.enemy?.name} 太强大了...</p>

          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Heart className="w-5 h-5 text-red-400" />
              <span>生命值已恢复至 50%</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold hover:shadow-lg hover:shadow-violet-500/30 btn-hover transition-all"
            >
              <Home className="w-4 h-4" />
              返回首页
            </button>
            <button
              onClick={() => {
                if (currentLevel) {
                  startBattle(currentLevel.id);
                }
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/15 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              再次挑战
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const cardRarityColor = (rarity) => {
  const colors = {
    N: '#9ca3af',
    R: '#3b82f6',
    SR: '#a855f7',
    SSR: '#f59e0b'
  };
  return colors[rarity] || '#9ca3af';
};

export default BattlePage;
