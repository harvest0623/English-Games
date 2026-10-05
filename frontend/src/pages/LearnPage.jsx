import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, RotateCcw, Check, X, ChevronRight, ChevronLeft, Volume2, Brain, Clock, Target, Sparkles, AlertCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { words } from '../data/gameData';

const INTERVALS = [0, 1, 3, 7, 15, 30];

const getNextReviewDate = (reviewCount) => {
  const days = INTERVALS[Math.min(reviewCount, INTERVALS.length - 1)];
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const isDueForReview = (wordId, mastery) => {
  if (!mastery || !mastery.nextReview) return true;
  return new Date(mastery.nextReview) <= new Date();
};

const LearnPage = () => {
  const navigate = useNavigate();
  const { player, words: gameWords, toggleFavorite, addWrongWord, updateTaskProgress, updateWordMastery } = useGame();

  const [mode, setMode] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0, reviewed: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const selectedWords = gameWords.filter(w => {
    if (player.selectedCategory === 'cet4') return ['abandon', 'ability', 'academic'].includes(w.word);
    if (player.selectedCategory === 'cet6') return ['accelerate', 'ambiguous'].includes(w.word);
    return true;
  });

  const getReviewWords = useCallback(() => {
    return selectedWords.filter(w => {
      const mastery = player.wordMastery?.[w.id];
      if (!mastery) return true;
      return isDueForReview(w.id, mastery);
    });
  }, [selectedWords, player.wordMastery]);

  const getNewWords = useCallback(() => {
    return selectedWords.filter(w => !player.learnedWords?.includes(w.id));
  }, [selectedWords, player.learnedWords]);

  const startLearning = (type) => {
    let wordQueue = [];
    if (type === 'review') {
      wordQueue = getReviewWords();
    } else if (type === 'new') {
      wordQueue = getNewWords().slice(0, 10);
    } else {
      wordQueue = [...getNewWords().slice(0, 5), ...getReviewWords().slice(0, 10)];
    }

    if (wordQueue.length === 0) {
      return;
    }

    wordQueue = wordQueue.sort(() => Math.random() - 0.5);
    setQueue(wordQueue);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ correct: 0, wrong: 0, reviewed: 0 });
    setIsComplete(false);
    setShowHint(false);
    setMode(type);
  };

  const handleKnown = () => {
    const word = queue[currentIndex];
    const currentMastery = player.wordMastery?.[word.id] || { level: 0, reviewCount: 0 };
    const newReviewCount = currentMastery.reviewCount + 1;

    updateWordMastery(word.id, {
      level: Math.min(currentMastery.level + 1, 5),
      reviewCount: newReviewCount,
      nextReview: getNextReviewDate(newReviewCount),
      lastReviewed: new Date().toISOString()
    });

    setSessionStats(prev => ({ ...prev, correct: prev.correct + 1, reviewed: prev.reviewed + 1 }));
    updateTaskProgress('answer_questions', 1);
    goNext();
  };

  const handleUnknown = () => {
    const word = queue[currentIndex];
    const currentMastery = player.wordMastery?.[word.id] || { level: 0, reviewCount: 0 };

    updateWordMastery(word.id, {
      level: Math.max(currentMastery.level - 1, 0),
      reviewCount: 0,
      nextReview: getNextReviewDate(0),
      lastReviewed: new Date().toISOString()
    });

    if (!player.wrongWords?.includes(word.id)) {
      addWrongWord(word.id);
    }

    setSessionStats(prev => ({ ...prev, wrong: prev.wrong + 1, reviewed: prev.reviewed + 1 }));
    goNext();
  };

  const goNext = () => {
    if (currentIndex + 1 >= queue.length) {
      setIsComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
      setShowHint(false);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
      setShowHint(false);
    }
  };

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const reviewWords = getReviewWords();
  const newWords = getNewWords();
  const currentWord = queue[currentIndex];

  if (!mode) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gradient font-display mb-3 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-violet-400" />
            单词学习
          </h1>
          <p className="text-gray-500">选择学习模式，高效记忆单词</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <button
            onClick={() => startLearning('new')}
            className="glass-card rounded-2xl p-6 text-left hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">学习新词</h3>
            <p className="text-sm text-gray-500 mb-4">学习尚未掌握的新单词</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-violet-400 font-bold">{newWords.length}</span>
              <span className="text-gray-500">个待学习</span>
            </div>
          </button>

          <button
            onClick={() => startLearning('review')}
            className="glass-card rounded-2xl p-6 text-left hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <RotateCcw className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">复习单词</h3>
            <p className="text-sm text-gray-500 mb-4">复习需要巩固的旧单词</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-amber-400 font-bold">{reviewWords.length}</span>
              <span className="text-gray-500">个待复习</span>
            </div>
          </button>

          <button
            onClick={() => startLearning('mixed')}
            className="glass-card rounded-2xl p-6 text-left hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">混合模式</h3>
            <p className="text-sm text-gray-500 mb-4">新词+复习，全面学习</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-400 font-bold">{newWords.length + reviewWords.length}</span>
              <span className="text-gray-500">个待学习</span>
            </div>
          </button>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-violet-400" />
            艾宾浩斯遗忘曲线
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            系统会根据遗忘曲线自动安排复习时间，帮助你长期记忆单词。当你标记「认识」的单词会被安排在更远的日期复习，而「不认识」的单词会被立即安排重新学习。
          </p>
          <div className="flex flex-wrap gap-3">
            {['第1次：立即', '第2次：1天后', '第3次：3天后', '第4次：7天后', '第5次：15天后', '第6次：30天后'].map((item, idx) => (
              <span key={idx} className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const accuracy = sessionStats.reviewed > 0
      ? Math.round((sessionStats.correct / sessionStats.reviewed) * 100)
      : 0;

    return (
      <div className="max-w-lg mx-auto">
        <div className="glass-card rounded-3xl p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/25">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">学习完成！</h2>
          <p className="text-gray-400 mb-8">太棒了，你完成了本次学习任务</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-2xl font-bold text-green-400">{sessionStats.correct}</div>
              <div className="text-xs text-gray-500">认识</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-2xl font-bold text-red-400">{sessionStats.wrong}</div>
              <div className="text-xs text-gray-500">不认识</div>
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
              继续学习
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
  const mastery = player.wordMastery?.[currentWord?.id];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setMode(null)}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          退出学习
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
        <div
          className={`relative glass-card rounded-3xl p-8 min-h-[350px] cursor-pointer transition-all duration-500 ${
            isFlipped ? 'bg-gradient-to-b from-[#1a1a3e] to-[#12122a]' : ''
          }`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {!isFlipped ? (
            <div className="flex flex-col items-center justify-center h-full">
              <button
                onClick={(e) => { e.stopPropagation(); speakWord(currentWord.word); }}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <Volume2 className="w-5 h-5" />
              </button>

              <h2 className="text-4xl font-bold text-white mb-3 font-display">{currentWord.word}</h2>
              <p className="text-lg text-gray-400 mb-6">{currentWord.phonetic}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                点击翻转查看释义
              </p>

              {mastery && (
                <div className="absolute bottom-4 left-4 text-xs text-gray-600">
                  已复习 {mastery.reviewCount} 次
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-bold text-white mb-2">{currentWord.word}</h2>
              <p className="text-sm text-gray-400 mb-4">{currentWord.phonetic}</p>

              <div className="w-16 h-px bg-violet-500/30 mb-4" />

              <p className="text-xl text-violet-300 font-semibold mb-4">{currentWord.meaning}</p>

              <div className="w-full p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] mb-2">
                <p className="text-sm text-gray-300 italic mb-1">{currentWord.example}</p>
                <p className="text-xs text-gray-500">{currentWord.exampleTranslation}</p>
              </div>

              {currentWord.tags && (
                <div className="flex gap-2 mt-3">
                  {currentWord.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {isFlipped && (
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleUnknown}
            className="flex-1 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-sm hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            不认识
          </button>
          <button
            onClick={handleKnown}
            className="flex-1 py-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-sm hover:bg-green-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            认识
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="p-2 rounded-lg text-gray-500 hover:text-white disabled:opacity-30 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-1.5">
          {queue.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex ? 'bg-violet-400' :
                idx < currentIndex ? 'bg-green-400/50' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
        <button
          onClick={goNext}
          disabled={currentIndex >= queue.length - 1}
          className="p-2 rounded-lg text-gray-500 hover:text-white disabled:opacity-30 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default LearnPage;
