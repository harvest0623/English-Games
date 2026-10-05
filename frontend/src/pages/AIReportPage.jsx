import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Sparkles, TrendingUp, TrendingDown, Lightbulb,
  Target, Heart, ArrowRight, BookOpen, Clock, BarChart3,
  AlertTriangle, Loader2, ChevronRight, Zap, Brain
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { aiApi } from '../services/api';

const PRIORITY_CONFIG = {
  high: { label: '重要', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  medium: { label: '建议', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  low: { label: '可选', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
};

const LEVEL_LABEL = {
  beginner: '初学者',
  intermediate: '进阶',
  advanced: '高级',
};

const AIReportPage = () => {
  const navigate = useNavigate();
  const { player } = useGame();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    const data = {
      studyStats: player.studyStats,
      learnedWords: player.learnedWords,
      wrongWords: player.wrongWords,
      wordMastery: player.wordMastery,
      level: player.level,
      selectedCategory: player.selectedCategory,
    };

    try {
      const [reportRes, recommendRes] = await Promise.all([
        aiApi.generateReport(data),
        aiApi.recommendPath(data),
      ]);
      setReport(reportRes);
      setRecommendation(recommendRes);
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('401') || msg.includes('403') || msg.includes('AI') || msg.includes('OPENAI') || msg.includes('openai')) {
        setError('AI 功能尚未配置，请在后端配置 OpenAI API Key 后重试。');
      } else {
        setError('生成报告失败，请稍后重试。');
      }
    } finally {
      setLoading(false);
    }
  };

  const totalWords = player.learnedWords?.length || 0;
  const wrongCount = player.wrongWords?.length || 0;
  const accuracy = player.studyStats.totalCorrect + player.studyStats.totalWrong > 0
    ? Math.round((player.studyStats.totalCorrect / (player.studyStats.totalCorrect + player.studyStats.totalWrong)) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gradient font-display mb-3 flex items-center justify-center gap-3">
          <FileText className="w-8 h-8 text-violet-400" />
          AI 学习报告
        </h1>
        <p className="text-gray-500">基于你的学习数据，AI 为你生成个性化分析</p>
      </div>

      {!report && !loading && (
        <div className="glass-card rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mx-auto mb-5">
              <Brain className="w-8 h-8 text-violet-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">准备好生成你的学习报告了吗？</h2>
            <p className="text-sm text-gray-500">AI 将分析你的学习数据，生成个性化报告</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center">
              <div className="text-lg font-bold text-violet-400">Lv.{player.level}</div>
              <div className="text-[11px] text-gray-500">当前等级</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center">
              <div className="text-lg font-bold text-green-400">{totalWords}</div>
              <div className="text-[11px] text-gray-500">已学单词</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center">
              <div className="text-lg font-bold text-red-400">{wrongCount}</div>
              <div className="text-[11px] text-gray-500">错词数</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center">
              <div className="text-lg font-bold text-amber-400">{accuracy}%</div>
              <div className="text-[11px] text-gray-500">正确率</div>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-300 font-medium">{error}</p>
                <p className="text-xs text-amber-400/60 mt-1">
                  请检查后端 .env 文件中是否配置了 OPENAI_API_KEY
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            生成报告
          </button>
        </div>
      )}

      {loading && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Loader2 className="w-10 h-10 text-violet-400 animate-spin mx-auto mb-4" />
          <p className="text-white font-medium mb-1">AI 正在分析你的学习数据...</p>
          <p className="text-xs text-gray-500">这可能需要一点时间，请耐心等待</p>
        </div>
      )}

      {report && !loading && (
        <div className="space-y-6">
          {report.level && (
            <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-xl shadow-violet-500/25 flex-shrink-0">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">总体水平</p>
                <h2 className="text-xl font-bold text-white">
                  {LEVEL_LABEL[report.level] || report.level}
                </h2>
              </div>
            </div>
          )}

          {report.summary && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-violet-400" />
                总结评价
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">{report.summary}</p>
            </div>
          )}

          {report.strengths?.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                优势
              </h3>
              <div className="flex flex-wrap gap-2">
                {report.strengths.map((item, idx) => (
                  <span key={idx} className="text-sm px-4 py-2 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {report.weaknesses?.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-400" />
                不足
              </h3>
              <div className="flex flex-wrap gap-2">
                {report.weaknesses.map((item, idx) => (
                  <span key={idx} className="text-sm px-4 py-2 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {report.suggestions?.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                建议
              </h3>
              <div className="space-y-3">
                {report.suggestions.map((item, idx) => {
                  const priority = item.priority || 'medium';
                  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
                  return (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border flex-shrink-0 mt-0.5 ${config.color}`}>
                        {config.label}
                      </span>
                      <p className="text-sm text-gray-300">{item.content || item.text || item}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {report.weeklyGoal && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                本周目标
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">{report.weeklyGoal}</p>
            </div>
          )}

          {report.encouragement && (
            <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 border-violet-500/10">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300 italic leading-relaxed">{report.encouragement}</p>
              </div>
            </div>
          )}

          {recommendation && (
            <div className="space-y-6">
              <div className="h-px bg-white/5" />

              <div className="text-center mb-2">
                <h2 className="text-xl font-bold text-gradient font-display flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6 text-violet-400" />
                  个性化学习推荐
                </h2>
              </div>

              {recommendation.recommendations?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendation.recommendations.map((item, idx) => (
                    <div key={idx} className="glass-card rounded-2xl p-5 hover:-translate-y-0.5 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                          {item.category}
                        </span>
                        {item.difficulty && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                            {item.difficulty}
                          </span>
                        )}
                      </div>
                      <h4 className="text-white font-bold text-sm mb-2">{item.title}</h4>
                      <p className="text-xs text-gray-500 mb-3 leading-relaxed">{item.description}</p>
                      {item.estimatedTime && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          预计 {item.estimatedTime}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {recommendation.nextCategory && (
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-violet-400" />
                    建议下一个词库
                  </h3>
                  <p className="text-sm text-gray-300">{recommendation.nextCategory}</p>
                </div>
              )}

              {recommendation.weakestArea && (
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    最需要加强的领域
                  </h3>
                  <p className="text-sm text-gray-300">{recommendation.weakestArea}</p>
                </div>
              )}

              {recommendation.dailyPlan && (
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    每日学习计划
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                    {recommendation.dailyPlan}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2 pb-8">
            <button
              onClick={() => { setReport(null); setRecommendation(null); setError(null); }}
              className="flex-1 py-3 rounded-xl bg-white/5 text-white font-semibold text-sm border border-white/10 hover:bg-white/10 transition-all"
            >
              重新生成
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all flex items-center justify-center gap-2"
            >
              返回
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {!report && !loading && error && (
        <div className="flex gap-3 mt-4 pb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-3 rounded-xl bg-white/5 text-white font-semibold text-sm border border-white/10 hover:bg-white/10 transition-all"
          >
            返回
          </button>
        </div>
      )}
    </div>
  );
};

export default AIReportPage;
