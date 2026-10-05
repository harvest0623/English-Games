import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, Sparkles, RefreshCw, Send, CheckCircle, Volume2, ArrowLeftRight, AlertCircle, Tag, BarChart3 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { aiApi } from '../services/api';

const AISentencePage = () => {
  const navigate = useNavigate();
  const { words: gameWords } = useGame();

  const [activeTab, setActiveTab] = useState('generate');

  const [selectedWord, setSelectedWord] = useState(null);
  const [manualWord, setManualWord] = useState('');
  const [manualMeaning, setManualMeaning] = useState('');
  const [sentenceContext, setSentenceContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sentences, setSentences] = useState([]);

  const [practiceWord, setPracticeWord] = useState(null);
  const [manualPracticeWord, setManualPracticeWord] = useState('');
  const [manualPracticeMeaning, setManualPracticeMeaning] = useState('');
  const [userSentence, setUserSentence] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null);

  const selectedWordsList = gameWords.filter(w => {
    if (!w.id) return true;
    return true;
  });

  const handleSelectWord = (word, type) => {
    if (type === 'generate') {
      setSelectedWord(word);
      setManualWord('');
      setManualMeaning('');
    } else {
      setPracticeWord(word);
      setManualPracticeWord('');
      setManualPracticeMeaning('');
    }
  };

  const getWordInfo = (type) => {
    if (type === 'generate') {
      if (manualWord.trim()) {
        return { word: manualWord.trim(), meaning: manualMeaning.trim() };
      }
      if (selectedWord) {
        return { word: selectedWord.word, meaning: selectedWord.meaning };
      }
    } else {
      if (manualPracticeWord.trim()) {
        return { word: manualPracticeWord.trim(), meaning: manualPracticeMeaning.trim() };
      }
      if (practiceWord) {
        return { word: practiceWord.word, meaning: practiceWord.meaning };
      }
    }
    return null;
  };

  const handleGenerate = async () => {
    const info = getWordInfo('generate');
    if (!info) return;
    setIsGenerating(true);
    try {
      const result = await aiApi.generateSentence(info.word, info.meaning, sentenceContext);
      setSentences(result.sentences || result.data?.sentences || []);
    } catch (err) {
      console.error('生成例句失败:', err);
      setSentences([]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCheck = async () => {
    const word = manualPracticeWord.trim() || practiceWord?.word || '';
    const meaning = manualPracticeMeaning.trim() || practiceWord?.meaning || '';
    if (!userSentence.trim() || !word) return;
    setIsChecking(true);
    try {
      const result = await aiApi.checkSentence(userSentence.trim(), word, meaning);
      setCheckResult(result);
    } catch (err) {
      console.error('检查句子失败:', err);
      setCheckResult(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSwitchWord = () => {
    const available = selectedWordsList.filter(w => practiceWord?.id !== w.id);
    const random = available[Math.floor(Math.random() * available.length)];
    setPracticeWord(random || null);
    setManualPracticeWord('');
    setManualPracticeMeaning('');
    setUserSentence('');
    setCheckResult(null);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const tabs = [
    { id: 'generate', label: '例句生成', icon: Sparkles },
    { id: 'practice', label: '造句练习', icon: PenTool }
  ];

  const getDifficultyLabel = (level) => {
    const map = { 1: '初级', 2: '中级', 3: '高级', 4: '专业', 5: '大师' };
    return map[level] || '中级';
  };

  const getDifficultyColor = (level) => {
    const map = {
      1: 'from-green-500/20 to-emerald-500/20 text-green-400',
      2: 'from-blue-500/20 to-cyan-500/20 text-blue-400',
      3: 'from-amber-500/20 to-orange-500/20 text-amber-400',
      4: 'from-red-500/20 to-pink-500/20 text-red-400',
      5: 'from-purple-500/20 to-fuchsia-500/20 text-purple-400'
    };
    return map[level] || map[2];
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gradient font-display mb-3 flex items-center justify-center gap-3">
          <PenTool className="w-8 h-8 text-violet-400" />
          AI 造句练习
        </h1>
        <p className="text-gray-500">用 AI 生成例句，练习造句并获得反馈</p>
      </div>

      <div className="flex gap-2 mb-8 justify-center">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSentences([]); setCheckResult(null); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'generate' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              选择一个单词
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
              {selectedWordsList.slice(0, 12).map(word => (
                <button
                  key={word.id}
                  onClick={() => handleSelectWord(word, 'generate')}
                  className={`p-3 rounded-xl text-left transition-all ${
                    selectedWord?.id === word.id
                      ? 'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30'
                      : 'bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="text-sm font-bold text-white">{word.word}</div>
                  <div className="text-xs text-gray-500 truncate mt-1">{word.meaning}</div>
                </button>
              ))}
            </div>
            <div className="border-t border-white/5 pt-4 mt-4">
              <p className="text-xs text-gray-500 mb-2">或手动输入单词：</p>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="英文单词"
                  value={manualWord}
                  onChange={(e) => { setManualWord(e.target.value); setSelectedWord(null); }}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                />
                <input
                  type="text"
                  placeholder="中文释义（可选）"
                  value={manualMeaning}
                  onChange={(e) => setManualMeaning(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">场景设置（可选）</h3>
            <input
              type="text"
              placeholder="例如：商务会议、日常对话、旅行等"
              value={sentenceContext}
              onChange={(e) => setSentenceContext(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || (!selectedWord && !manualWord.trim())}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  生成例句
                </>
              )}
            </button>
            {sentences.length > 0 && (
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-3.5 rounded-xl bg-white/5 text-white font-semibold text-sm border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                重新生成
              </button>
            )}
          </div>

          {sentences.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">生成的例句</h3>
              {sentences.map((sentence, idx) => (
                <div key={idx} className="glass-card rounded-2xl p-6 hover:-translate-y-0.5 transition-all">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <p className="text-lg text-white font-medium leading-relaxed flex-1">{sentence.sentence || sentence.en}</p>
                    <button
                      onClick={() => speakText(sentence.sentence || sentence.en)}
                      className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all shrink-0"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{sentence.translation || sentence.zh}</p>
                  <div className="flex gap-2 flex-wrap">
                    {(sentence.scenario || sentence.context) && (
                      <span className="text-xs px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {sentence.scenario || sentence.context}
                      </span>
                    )}
                    {sentence.difficulty && (
                      <span className={`text-xs px-3 py-1 rounded-full border border-white/10 flex items-center gap-1 bg-gradient-to-r ${getDifficultyColor(sentence.difficulty)}`}>
                        {getDifficultyLabel(sentence.difficulty)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <PenTool className="w-5 h-5 text-violet-400" />
                选择练习单词
              </h3>
              {practiceWord && (
                <button
                  onClick={handleSwitchWord}
                  className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  换一个词
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
              {selectedWordsList.slice(0, 8).map(word => (
                <button
                  key={word.id}
                  onClick={() => handleSelectWord(word, 'practice')}
                  className={`p-3 rounded-xl text-left transition-all ${
                    practiceWord?.id === word.id
                      ? 'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30'
                      : 'bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="text-sm font-bold text-white">{word.word}</div>
                  <div className="text-xs text-gray-500 truncate mt-1">{word.meaning}</div>
                </button>
              ))}
            </div>
            <div className="border-t border-white/5 pt-4 mt-4">
              <p className="text-xs text-gray-500 mb-2">或手动输入：</p>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="英文单词"
                  value={manualPracticeWord}
                  onChange={(e) => { setManualPracticeWord(e.target.value); setPracticeWord(null); }}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                />
                <input
                  type="text"
                  placeholder="中文释义（可选）"
                  value={manualPracticeMeaning}
                  onChange={(e) => setManualPracticeMeaning(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          {(practiceWord || manualPracticeWord.trim()) && (
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                  <PenTool className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">使用单词</p>
                  <p className="text-lg font-bold text-white">
                    {manualPracticeWord.trim() || practiceWord?.word}
                  </p>
                </div>
              </div>
              <textarea
                value={userSentence}
                onChange={(e) => setUserSentence(e.target.value)}
                placeholder="请用这个单词写一个英文句子..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleCheck}
                  disabled={isChecking || !userSentence.trim()}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isChecking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      检查中...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      提交检查
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {checkResult && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-violet-400" />
                评分结果
              </h3>

              <div className="glass-card rounded-2xl p-6 text-center">
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(checkResult.score ?? checkResult.data?.score ?? 0)}`}>
                  {checkResult.score ?? checkResult.data?.score ?? 0}
                </div>
                <p className="text-gray-400 text-sm">综合评分</p>
              </div>

              {(checkResult.grammar || checkResult.data?.grammar) && (
                <div className="glass-card rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    语法分析
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{checkResult.grammar || checkResult.data?.grammar}</p>
                </div>
              )}

              {(checkResult.vocabulary || checkResult.data?.vocabulary) && (
                <div className="glass-card rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-violet-400" />
                    词汇使用
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{checkResult.vocabulary || checkResult.data?.vocabulary}</p>
                </div>
              )}

              {(checkResult.suggestions || checkResult.data?.suggestions) && (
                <div className="glass-card rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    改进建议
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{checkResult.suggestions || checkResult.data?.suggestions}</p>
                </div>
              )}

              {(checkResult.betterExpression || checkResult.data?.betterExpression) && (
                <div className="glass-card rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    更好的表达方式
                  </h4>
                  <p className="text-sm text-cyan-300 leading-relaxed">{checkResult.betterExpression || checkResult.data?.betterExpression}</p>
                </div>
              )}

              <button
                onClick={() => { setUserSentence(''); setCheckResult(null); }}
                className="w-full py-3 rounded-xl bg-white/5 text-white font-semibold text-sm border border-white/10 hover:bg-white/10 transition-all"
              >
                清空并继续练习
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AISentencePage;
