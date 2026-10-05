import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenLine, Volume2, Check, X, RotateCcw, Eye, EyeOff, ArrowRight, Trophy, Target, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';

const SpellingPage = () => {
  const navigate = useNavigate();
  const { player, words: gameWords, addWrongWord, updateWordMastery, updateTaskProgress } = useGame();

  const [mode, setMode] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [result, setResult] = useState(null);
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const inputRef = useRef(null);

  const selectedWords = gameWords.filter(() => true);

  const getShuffledWords = useCallback((count) => {
    return [...selectedWords].sort(() => Math.random() - 0.5).slice(0, count);
  }, [selectedWords]);

  const startPractice = (type) => {
    const wordQueue = getShuffledWords(15);
    setQueue(wordQueue);
    setCurrentIndex(0);
    setInputValue('');
    setIsRevealed(false);
    setResult(null);
    setSessionStats({ correct: 0, wrong: 0 });
    setIsComplete(false);
    setShowMeaning(false);
    setMode(type);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const currentWord = queue[currentIndex];

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.7;
      window.speechSynthesis.speak(utterance);
    }
  };

  const checkSpelling = () => {
    if (!inputValue.trim() || !currentWord) return;
    const isCorrect = inputValue.trim().toLowerCase() === currentWord.word.toLowerCase();
    setResult(isCorrect);
    setIsRevealed(true);

    if (isCorrect) {
      setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));
      const mastery = player.wordMastery?.[currentWord.id] || { level: 0, reviewCount: 0 };
      updateWordMastery(currentWord.id, {
        level: Math.min(mastery.level + 1, 5),
        reviewCount: mastery.reviewCount + 1,
        nextReview: new Date(Date.now() + (mastery.reviewCount + 1) * 86400000).toISOString(),
        lastReviewed: new Date().toISOString()
      });
    } else {
      setSessionStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
      addWrongWord(currentWord.id);
    }
    updateTaskProgress('answer_questions', 1);
  };

  const goNext = () => {
    if (currentIndex + 1 >= queue.length) {
      setIsComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setInputValue('');
      setIsRevealed(false);
      setResult(null);
      setShowMeaning(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (isRevealed) {
        goNext();
      } else {
        checkSpelling();
      }
    }
  };

  useEffect(() => {
    if (mode && !isComplete) {
      const handler = (e) => {
        if (e.key === ' ' && !isRevealed && document.activeElement !== inputRef.current) {
          e.preventDefault();
          if (currentWord) speakWord(currentWord.word);
        }
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }
  }, [mode, isComplete, currentWord, isRevealed]);

  useEffect(() => {
    if (mode && !isComplete && currentWord && mode === 'listen') {
      const timer = setTimeout(() => speakWord(currentWord.word), 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, mode, isComplete, currentWord]);

  if (!mode) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gradient font-display mb-3 flex items-center justify-center gap-3">
            <PenLine className="w-8 h-8 text-violet-400" />
            拼写练习
          </h1>
          <p className="text-gray-500">通过拼写强化记忆，掌握单词拼写</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <button
            onClick={() => startPractice('listen')}
            className="glass-card rounded-2xl p-6 text-left hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Volume2 className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">听音拼写</h3>
            <p className="text-sm text-gray-500">听发音，根据听到的内容拼写单词</p>
          </button>

          <button
            onClick={() => startPractice('meaning')}
            className="glass-card rounded-2xl p-6 text-left hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">释义拼写</h3>
            <p className="text-sm text-gray-500">看中文释义，拼写对应的英文单词</p>
          </button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const accuracy = sessionStats.correct + sessionStats.wrong > 0
      ? Math.round((sessionStats.correct / (sessionStats.correct + sessionStats.wrong)) * 100)
      : 0;

    return (
      <div className="max-w-lg mx-auto">
        <div className="glass-card rounded-3xl p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/25">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">练习完成！</h2>
          <p className="text-gray-400 mb-8">你的拼写水平在不断提升</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-2xl font-bold text-green-400">{sessionStats.correct}</div>
              <div className="text-xs text-gray-500">正确</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-2xl font-bold text-red-400">{sessionStats.wrong}</div>
              <div className="text-xs text-gray-500">错误</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-2xl font-bold text-violet-400">{accuracy}%</div>
              <div className="text-xs text-gray-500">正确率</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setMode(null)}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all"
            >
              再练一次
            </button>
            <button
              onClick={() => navigate('/wordbook')}
              className="flex-1 py-3 rounded-xl bg-white/5 text-white font-semibold text-sm border border-white/10 hover:bg-white/10 transition-all"
            >
              查看单词本
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / queue.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setMode(null)}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          退出练习
        </button>
        <span className="text-sm text-gray-400">
          {currentIndex + 1} / {queue.length}
        </span>
      </div>

      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-8">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {currentWord && (
        <div className="glass-card rounded-3xl p-8">
          <div className="text-center mb-8">
            {mode === 'listen' ? (
              <div>
                <button
                  onClick={() => speakWord(currentWord.word)}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform"
                >
                  <Volume2 className="w-8 h-8 text-violet-400" />
                </button>
                <p className="text-sm text-gray-400">点击播放发音，听音拼写</p>
              </div>
            ) : (
              <div>
                <p className="text-xl text-violet-300 font-semibold mb-2">{currentWord.meaning}</p>
                <button
                  onClick={() => setShowMeaning(!showMeaning)}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1 mx-auto"
                >
                  {showMeaning ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showMeaning ? '隐藏提示' : '显示提示'}
                </button>
                {showMeaning && (
                  <p className="text-xs text-gray-600 mt-2">
                    首字母: {currentWord.word[0]} · {currentWord.word.length} 个字母
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="relative mb-6">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isRevealed}
              placeholder="输入单词拼写..."
              className={`w-full px-6 py-4 rounded-xl bg-white/[0.03] border text-white text-lg text-center tracking-wider font-mono focus:outline-none transition-all ${
                isRevealed
                  ? result
                    ? 'border-green-500/50 bg-green-500/5'
                    : 'border-red-500/50 bg-red-500/5'
                  : 'border-white/8 focus:border-violet-500/40'
              }`}
              autoFocus
            />
          </div>

          {isRevealed && (
            <div className={`p-4 rounded-xl mb-4 ${
              result ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {result ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <X className="w-5 h-5 text-red-400" />
                )}
                <span className={`font-bold ${result ? 'text-green-400' : 'text-red-400'}`}>
                  {result ? '拼写正确！' : '拼写错误'}
                </span>
              </div>
              {!result && (
                <div>
                  <p className="text-sm text-gray-400">正确拼写：<span className="text-white font-bold">{currentWord.word}</span></p>
                  <p className="text-xs text-gray-500 mt-1">{currentWord.phonetic} · {currentWord.meaning}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            {!isRevealed ? (
              <>
                <button
                  onClick={() => speakWord(currentWord.word)}
                  className="px-4 py-3 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <button
                  onClick={checkSpelling}
                  disabled={!inputValue.trim()}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50"
                >
                  确认
                </button>
              </>
            ) : (
              <button
                onClick={goNext}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all flex items-center justify-center gap-2"
              >
                下一个
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpellingPage;
