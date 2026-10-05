import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Layers, ArrowLeft, Loader2, AlertCircle, Sparkles, BookOpen, Tag } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { aiApi } from '../services/api';

const quickWords = ['abandon', 'unprecedented', 'international', 'understanding'];

const AIWordAnalysisPage = () => {
  const navigate = useNavigate();
  const {} = useGame();

  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (targetWord) => {
    const w = targetWord || word.trim();
    if (!w) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setWord(w);

    try {
      const data = await aiApi.analyzeWord(w);
      setResult(data);
    } catch (err) {
      if (err.message.includes('400') || err.message.includes('not configured') || err.message.includes('AI')) {
        setError('AI 服务尚未配置，请先在设置中配置 API Key');
      } else {
        setError('分析失败，请稍后再试');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAnalyze();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/ai')}
          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          返回 AI 中心
        </button>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gradient font-display mb-3 flex items-center justify-center gap-3">
          <Layers className="w-8 h-8 text-violet-400" />
          词根词缀分析
        </h1>
        <p className="text-gray-500">输入单词，AI 将为你解析词根、前缀、后缀与词源</p>
      </div>

      <div className="glass-card rounded-2xl p-6 mb-8">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入英文单词..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-base focus:outline-none focus:border-violet-500/40 transition-all placeholder-gray-600"
              autoFocus
            />
          </div>
          <button
            onClick={() => handleAnalyze()}
            disabled={!word.trim() || loading}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            分析
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-xs text-gray-600 leading-6">快捷：</span>
          {quickWords.map((qw) => (
            <button
              key={qw}
              onClick={() => handleAnalyze(qw)}
              disabled={loading}
              className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
            >
              {qw}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="glass-card rounded-2xl p-12 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
          <p className="text-gray-400 text-sm">AI 正在分析单词结构...</p>
          <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">出错了</h3>
          <p className="text-sm text-gray-400 mb-6">{error}</p>
          {error.includes('配置') && (
            <button
              onClick={() => navigate('/settings')}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all"
            >
              前往设置
            </button>
          )}
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 text-center">
            <h2 className="text-4xl font-bold text-white font-display mb-2">{result.word}</h2>
            {result.phonetic && (
              <p className="text-gray-400 text-sm mb-4">{result.phonetic}</p>
            )}
            {result.etymology && (
              <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] text-left">
                <h4 className="text-sm font-bold text-violet-400 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  词源故事
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed">{result.etymology}</p>
              </div>
            )}
          </div>

          {result.roots && result.roots.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-violet-400" />
                词根
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.roots.map((root, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/10">
                    <div className="text-base font-bold text-violet-300 mb-1">{root.root}</div>
                    {root.origin && (
                      <div className="text-xs text-gray-500 mb-1">来源: {root.origin}</div>
                    )}
                    <div className="text-sm text-gray-400">{root.meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.prefixes && result.prefixes.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-5 h-5 text-blue-400 font-mono text-sm font-bold">+</span>
                前缀
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.prefixes.map((prefix, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <div className="text-base font-bold text-blue-300 mb-1">{prefix.prefix || prefix.root}</div>
                    {prefix.origin && (
                      <div className="text-xs text-gray-500 mb-1">来源: {prefix.origin}</div>
                    )}
                    <div className="text-sm text-gray-400">{prefix.meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.suffixes && result.suffixes.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-5 h-5 text-green-400 font-mono text-sm font-bold">-</span>
                后缀
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.suffixes.map((suffix, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                    <div className="text-base font-bold text-green-300 mb-1">{suffix.suffix || suffix.root}</div>
                    {suffix.origin && (
                      <div className="text-xs text-gray-500 mb-1">来源: {suffix.origin}</div>
                    )}
                    <div className="text-sm text-gray-400">{suffix.meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.cognates && result.cognates.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-400" />
                同源词
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.cognates.map((cognate, idx) => (
                  <span
                    key={idx}
                    className="text-sm px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20"
                  >
                    {cognate}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.memoryTip && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-400" />
                记忆技巧
              </h3>
              <div className="p-4 rounded-xl bg-pink-500/5 border border-pink-500/10">
                <p className="text-sm text-gray-300 leading-relaxed">{result.memoryTip}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {!result && !loading && !error && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mx-auto mb-4">
            <Layers className="w-8 h-8 text-violet-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">输入单词开始分析</h3>
          <p className="text-sm text-gray-500">AI 将为你解析单词的词根、前缀、后缀和词源故事</p>
        </div>
      )}
    </div>
  );
};

export default AIWordAnalysisPage;
