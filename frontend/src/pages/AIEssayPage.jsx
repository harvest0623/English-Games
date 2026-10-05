import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronLeft, Loader2, AlertTriangle, Check, X, PenLine, RotateCcw } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { aiApi } from '../services/api';

const AIEssayPage = () => {
  const navigate = useNavigate();
  const { player } = useGame();

  const [essay, setEssay] = useState('');
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;
  const canSubmit = wordCount >= 20;

  const handleSubmit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const levelMap = { 1: '初学者', 5: '中级', 10: '高级' };
      const level = Object.entries(levelMap).reverse().find(([l]) => player.level >= Number(l))?.[1] || '初学者';
      const res = await aiApi.checkEssay(essay, topic || undefined, level);
      setResult(res);
    } catch (err) {
      setError(err.message || '批改失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEssay('');
    setTopic('');
    setResult(null);
    setError('');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBarColor = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-amber-500 to-yellow-500';
    return 'from-red-500 to-rose-500';
  };

  const dimensions = result ? [
    { label: '语法', score: result.grammarScore, icon: '📝' },
    { label: '词汇', score: result.vocabularyScore, icon: '📚' },
    { label: '结构', score: result.structureScore, icon: '🏗️' },
    { label: '内容', score: result.contentScore, icon: '💡' },
  ] : [];

  const circumference = 2 * Math.PI * 54;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate('/ai')}
          className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gradient font-display flex items-center gap-2">
            <FileText className="w-6 h-6 text-orange-400" />
            AI 作文批改
          </h1>
          <p className="text-sm text-gray-500">AI 从多维度批改你的英语作文</p>
        </div>
      </div>

      {!result && (
        <div className="glass-card rounded-3xl p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">作文主题（可选）</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="例如：My Favorite Season"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-orange-500/40 transition-all placeholder:text-gray-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">你的英语作文</label>
            <textarea
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="Write your essay here... (At least 20 words)"
              rows={10}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm leading-relaxed focus:outline-none focus:border-orange-500/40 transition-all placeholder:text-gray-600 resize-none"
            />
            <div className="flex justify-between mt-2">
              <span className={`text-xs ${wordCount < 20 ? 'text-amber-400' : 'text-green-400'}`}>
                {wordCount} 词 {wordCount < 20 && `(至少需要 20 词)`}
              </span>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                AI 正在批改...
              </>
            ) : (
              <>
                <PenLine className="w-4 h-4" />
                提交批改
              </>
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="glass-card rounded-2xl p-4 mb-6 border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-8 text-center">
            <div className="relative w-36 h-36 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="54" fill="none"
                  className={`stroke-orange-400`}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (result.totalScore / 100) * circumference}
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${getScoreColor(result.totalScore)}`}>
                  {result.totalScore}
                </span>
                <span className="text-xs text-gray-500">总分</span>
              </div>
            </div>
            <p className="text-gray-300">{result.overallFeedback}</p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-4">维度评分</h3>
            <div className="space-y-4">
              {dimensions.map((dim) => (
                <div key={dim.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-400">{dim.icon} {dim.label}</span>
                    <span className={`text-sm font-bold ${getScoreColor(dim.score)}`}>{dim.score}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getScoreBarColor(dim.score)} transition-all duration-1000`}
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {result.grammarErrors && result.grammarErrors.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <X className="w-4 h-4 text-red-400" />
                语法错误
              </h3>
              <div className="space-y-3">
                {result.grammarErrors.map((err, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-red-400 line-through text-sm">{err.original}</span>
                      <span className="text-gray-600">→</span>
                      <span className="text-green-400 text-sm font-bold">{err.corrected}</span>
                    </div>
                    <p className="text-xs text-gray-500">{err.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-2">📚 词汇评价</h3>
              <p className="text-sm text-gray-400">{result.vocabularyFeedback}</p>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-2">🏗️ 结构评价</h3>
              <p className="text-sm text-gray-400">{result.structureFeedback}</p>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-2">💡 内容评价</h3>
              <p className="text-sm text-gray-400">{result.contentFeedback}</p>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-2">✨ 改进建议</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                {result.keySuggestions?.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {result.improvedVersion && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                修改后的优秀版本
              </h3>
              <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{result.improvedVersion}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleReset}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            重新批改
          </button>
        </div>
      )}
    </div>
  );
};

export default AIEssayPage;
