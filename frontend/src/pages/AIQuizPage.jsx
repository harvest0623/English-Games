import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain, Sparkles, Play, Check, X, ChevronRight, ChevronLeft,
  AlertTriangle, Loader2, RotateCcw, ArrowRight, ListChecks,
  PenLine, Link2, Trophy, Target, RotateCw
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { aiApi } from '../services/api';

const QUIZ_COUNTS = [5, 10, 15, 20];

const QUESTION_TYPE_CONFIG = {
  choice: { icon: ListChecks, label: '选择题' },
  fill: { icon: PenLine, label: '填空题' },
  match: { icon: Link2, label: '配对题' },
};

const AIQuizPage = () => {
  const navigate = useNavigate();
  const { player, words: gameWords } = useGame();

  const [phase, setPhase] = useState('setup');
  const [quizCount, setQuizCount] = useState(10);
  const [dataSource, setDataSource] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [fillInput, setFillInput] = useState('');
  const [matchPairs, setMatchPairs] = useState({ left: null, right: null });
  const [matchSelected, setMatchSelected] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [results, setResults] = useState({ correct: 0, wrong: 0 });

  const getSourceWords = useCallback(() => {
    let pool = [...gameWords];
    if (dataSource === 'wrong') {
      pool = gameWords.filter(w => player.wrongWords?.includes(w.id));
    } else if (player.selectedCategory) {
      pool = gameWords.filter(w => {
        if (player.selectedCategory === 'cet4') return ['abandon', 'ability', 'academic'].includes(w.word);
        if (player.selectedCategory === 'cet6') return ['accelerate', 'ambiguous'].includes(w.word);
        return true;
      });
    }
    return pool;
  }, [gameWords, dataSource, player.selectedCategory, player.wrongWords]);

  const startQuiz = async () => {
    const sourceWords = getSourceWords();
    if (sourceWords.length === 0) {
      setError('当前没有可用的单词，请先学习一些单词或检查词库选择。');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await aiApi.generateQuiz(sourceWords, quizCount);
      const qs = Array.isArray(res.questions) ? res.questions : Array.isArray(res) ? res : [];
      if (qs.length === 0) {
        throw new Error('未返回题目');
      }
      setQuestions(qs);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setFillInput('');
      setMatchPairs({ left: null, right: null });
      setMatchSelected([]);
      setAnswered(false);
      setIsCorrect(false);
      setResults({ correct: 0, wrong: 0 });
      setPhase('quiz');
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('401') || msg.includes('403') || msg.includes('AI') || msg.includes('OPENAI') || msg.includes('openai')) {
        setError('AI 功能尚未配置，请在后端配置 OpenAI API Key 后重试。');
      } else {
        setError('生成题目失败，请稍后重试。');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = () => {
    const q = questions[currentIndex];
    let correct = false;

    if (q.type === 'choice') {
      correct = selectedAnswer === q.correctAnswer;
    } else if (q.type === 'fill') {
      const input = fillInput.trim().toLowerCase();
      const ans = (q.correctAnswer || q.answer || '').trim().toLowerCase();
      correct = input === ans;
    } else if (q.type === 'match') {
      const correctPairs = q.pairs || q.correctPairs || [];
      correct = matchSelected.length === correctPairs.length &&
        matchSelected.every(p => correctPairs.some(cp => cp.left === p.left && cp.right === p.right));
    }

    setIsCorrect(correct);
    setAnswered(true);
    setResults(prev => correct
      ? { ...prev, correct: prev.correct + 1 }
      : { ...prev, wrong: prev.wrong + 1 }
    );
  };

  const goNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setPhase('complete');
      return;
    }
    setCurrentIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setFillInput('');
    setMatchPairs({ left: null, right: null });
    setMatchSelected([]);
    setAnswered(false);
    setIsCorrect(false);
  };

  const restart = () => {
    setPhase('setup');
    setQuestions([]);
    setCurrentIndex(0);
    setError(null);
    setResults({ correct: 0, wrong: 0 });
  };

  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const currentQ = questions[currentIndex];

  const handleMatchClick = (side, value) => {
    if (answered) return;
    const newPairs = { ...matchPairs, [side]: value };
    setMatchPairs(newPairs);

    if (newPairs.left !== null && newPairs.right !== null) {
      const alreadyExists = matchSelected.some(
        p => p.left === newPairs.left && p.right === newPairs.right
      );
      if (!alreadyExists) {
        setMatchSelected(prev => [...prev, { left: newPairs.left, right: newPairs.right }]);
      }
      setMatchPairs({ left: null, right: null });
    }
  };

  const removeMatchPair = (idx) => {
    if (answered) return;
    setMatchSelected(prev => prev.filter((_, i) => i !== idx));
  };

  if (phase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gradient font-display mb-3 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-violet-400" />
            AI 智能出题
          </h1>
          <p className="text-gray-500">AI 根据你的学习情况生成个性化练习题</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mx-auto mb-5">
              <Sparkles className="w-8 h-8 text-violet-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">设置你的练习</h2>
            <p className="text-sm text-gray-500">选择题目来源和数量</p>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-300 mb-3 block">题目来源</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDataSource('all')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  dataSource === 'all'
                    ? 'bg-violet-500/10 border-violet-500/30 shadow-lg shadow-violet-500/10'
                    : 'bg-white/[0.03] border-white/[0.05] hover:bg-white/[0.06]'
                }`}
              >
                <p className="text-sm font-bold text-white mb-1">当前词库</p>
                <p className="text-[11px] text-gray-500">从你选择的词库中出题</p>
              </button>
              <button
                onClick={() => setDataSource('wrong')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  dataSource === 'wrong'
                    ? 'bg-violet-500/10 border-violet-500/30 shadow-lg shadow-violet-500/10'
                    : 'bg-white/[0.03] border-white/[0.05] hover:bg-white/[0.06]'
                }`}
              >
                <p className="text-sm font-bold text-white mb-1">错词本</p>
                <p className="text-[11px] text-gray-500">针对错词重点练习</p>
                {player.wrongWords?.length > 0 && (
                  <span className="inline-block mt-2 text-[11px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">
                    {player.wrongWords.length} 个错词
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="mb-8">
            <label className="text-sm font-medium text-gray-300 mb-3 block">出题数量</label>
            <div className="grid grid-cols-4 gap-3">
              {QUIZ_COUNTS.map(count => (
                <button
                  key={count}
                  onClick={() => setQuizCount(count)}
                  className={`py-3 rounded-xl text-sm font-bold transition-all ${
                    quizCount === count
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {count} 题
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-300">{error}</p>
            </div>
          )}

          <button
            onClick={startQuiz}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                AI 正在出题...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                开始出题
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'quiz' && currentQ) {
    const TypeIcon = QUESTION_TYPE_CONFIG[currentQ.type]?.icon || ListChecks;
    const typeLabel = QUESTION_TYPE_CONFIG[currentQ.type]?.label || currentQ.type;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setPhase('setup')}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            退出答题
          </button>
          <span className="text-sm text-gray-400">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-8">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="glass-card rounded-3xl p-8 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <TypeIcon className="w-4 h-4 text-violet-400" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              {typeLabel}
            </span>
          </div>

          {currentQ.type === 'choice' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 font-display">{currentQ.word || currentQ.question}</h2>
              {currentQ.phonetic && <p className="text-sm text-gray-400 mb-6">{currentQ.phonetic}</p>}
              {currentQ.instruction && <p className="text-sm text-gray-400 mb-4">{currentQ.instruction}</p>}
              <div className="space-y-3 mt-4">
                {(currentQ.options || []).map((opt, idx) => {
                  const isSelected = selectedAnswer === opt;
                  const isAnswer = opt === currentQ.correctAnswer;
                  let btnClass = 'bg-white/[0.03] border-white/[0.05] text-gray-300 hover:bg-white/[0.06]';
                  if (answered && isAnswer) {
                    btnClass = 'bg-green-500/10 border-green-500/30 text-green-400';
                  } else if (answered && isSelected && !isAnswer) {
                    btnClass = 'bg-red-500/10 border-red-500/30 text-red-400';
                  } else if (isSelected && !answered) {
                    btnClass = 'bg-violet-500/10 border-violet-500/30 text-violet-400';
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => !answered && setSelectedAnswer(opt)}
                      disabled={answered}
                      className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center gap-3 ${btnClass}`}
                    >
                      <span className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {opt}
                      {answered && isAnswer && <Check className="w-4 h-4 ml-auto text-green-400" />}
                      {answered && isSelected && !isAnswer && <X className="w-4 h-4 ml-auto text-red-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentQ.type === 'fill' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 font-display">{currentQ.question || currentQ.word}</h2>
              {currentQ.hint && <p className="text-sm text-gray-400 mb-2">{currentQ.hint}</p>}
              {currentQ.instruction && <p className="text-sm text-gray-400 mb-4">{currentQ.instruction}</p>}
              <div className="mt-4">
                <input
                  type="text"
                  value={fillInput}
                  onChange={e => setFillInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !answered && fillInput.trim()) checkAnswer(); }}
                  disabled={answered}
                  placeholder="输入答案..."
                  className="w-full p-4 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white text-lg font-display placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 transition-all disabled:opacity-50"
                />
              </div>
            </div>
          )}

          {currentQ.type === 'match' && (
            <div>
              <h2 className="text-lg font-bold text-white mb-2">将左右两边的内容配对</h2>
              {currentQ.instruction && <p className="text-sm text-gray-400 mb-4">{currentQ.instruction}</p>}

              {matchSelected.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {matchSelected.map((pair, idx) => (
                    <span
                      key={idx}
                      onClick={() => removeMatchPair(idx)}
                      className="text-xs px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 flex items-center gap-1.5 cursor-pointer hover:bg-violet-500/20 transition-all"
                    >
                      {pair.left} → {pair.right}
                      {!answered && <X className="w-3 h-3" />}
                    </span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500 mb-2">英文</p>
                  <div className="space-y-2">
                    {(currentQ.leftItems || currentQ.words || []).map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleMatchClick('left', item)}
                        disabled={answered}
                        className={`w-full p-3 rounded-xl border text-left text-sm transition-all ${
                          matchPairs.left === item
                            ? 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                            : matchSelected.some(p => p.left === item)
                              ? 'bg-green-500/10 border-green-500/20 text-green-400 opacity-60'
                              : 'bg-white/[0.03] border-white/[0.05] text-gray-300 hover:bg-white/[0.06]'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">中文</p>
                  <div className="space-y-2">
                    {(currentQ.rightItems || currentQ.meanings || []).map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleMatchClick('right', item)}
                        disabled={answered}
                        className={`w-full p-3 rounded-xl border text-left text-sm transition-all ${
                          matchPairs.right === item
                            ? 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                            : matchSelected.some(p => p.right === item)
                              ? 'bg-green-500/10 border-green-500/20 text-green-400 opacity-60'
                              : 'bg-white/[0.03] border-white/[0.05] text-gray-300 hover:bg-white/[0.06]'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {answered && currentQ.explanation && (
            <div className={`mt-6 p-4 rounded-xl border ${isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? <Check className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-red-400" />}
                <span className={`text-sm font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrect ? '回答正确！' : '回答错误'}
                </span>
              </div>
              <p className="text-xs text-gray-400">{currentQ.explanation}</p>
            </div>
          )}

          {answered && !isCorrect && (currentQ.type === 'fill' || currentQ.type === 'choice') && (
            <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <p className="text-xs text-gray-500">正确答案</p>
              <p className="text-sm text-green-400 font-medium">
                {currentQ.correctAnswer || currentQ.answer}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {!answered ? (
            <button
              onClick={checkAnswer}
              disabled={
                (currentQ.type === 'choice' && !selectedAnswer) ||
                (currentQ.type === 'fill' && !fillInput.trim()) ||
                (currentQ.type === 'match' && matchSelected.length === 0)
              }
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              确认答案
            </button>
          ) : (
            <button
              onClick={goNext}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all flex items-center justify-center gap-2"
            >
              {currentIndex + 1 >= questions.length ? '查看结果' : '下一题'}
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'complete') {
    const total = results.correct + results.wrong;
    const accuracy = total > 0 ? Math.round((results.correct / total) * 100) : 0;

    return (
      <div className="max-w-lg mx-auto">
        <div className="glass-card rounded-3xl p-8 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl ${
            accuracy >= 80
              ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-green-500/25'
              : accuracy >= 60
                ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/25'
                : 'bg-gradient-to-br from-red-500 to-rose-500 shadow-red-500/25'
          }`}>
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">答题完成！</h2>
          <p className="text-gray-400 mb-8">
            {accuracy >= 80 ? '太棒了，继续保持！' : accuracy >= 60 ? '不错的表现，继续加油！' : '还需要多加练习哦！'}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-2xl font-bold text-violet-400">{accuracy}%</div>
              <div className="text-xs text-gray-500">正确率</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-2xl font-bold text-green-400">{results.correct}</div>
              <div className="text-xs text-gray-500">答对</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-2xl font-bold text-red-400">{results.wrong}</div>
              <div className="text-xs text-gray-500">答错</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={restart}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              再来一次
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-3 rounded-xl bg-white/5 text-white font-semibold text-sm border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              返回
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AIQuizPage;
