import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Volume2, ChevronLeft, RotateCcw, Loader2, AlertTriangle, Check, X, Loader } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { aiApi } from '../services/api';

const AIPronunciationPage = () => {
  const navigate = useNavigate();
  const { player, words: gameWords } = useGame();

  const [selectedWord, setSelectedWord] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const recognitionRef = useRef(null);

  const availableWords = gameWords || [];

  const pickRandomWord = () => {
    const word = availableWords[Math.floor(Math.random() * availableWords.length)];
    setSelectedWord(word);
    setRecognizedText('');
    setResult(null);
    setError('');
  };

  useEffect(() => {
    if (availableWords.length > 0 && !selectedWord) {
      pickRandomWord();
    }
  }, []);

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.7;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('你的浏览器不支持语音识别，请使用 Chrome 浏览器');
      return;
    }

    setRecognizedText('');
    setResult(null);
    setError('');

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (event) => {
      setIsRecording(false);
      if (event.error === 'no-speech') {
        setError('没有检测到语音，请再试一次');
      } else if (event.error === 'not-allowed') {
        setError('请允许麦克风权限后重试');
      } else {
        setError(`识别出错: ${event.error}`);
      }
    };

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      setRecognizedText(text);

      if (selectedWord) {
        setLoading(true);
        try {
          const evalResult = await aiApi.evaluatePronunciation(
            selectedWord.word,
            selectedWord.phonetic,
            text
          );
          setResult(evalResult);
          setHistory(prev => [{ word: selectedWord.word, score: evalResult.score, text, time: Date.now() }, ...prev].slice(0, 20));
        } catch (err) {
          setError(err.message || '评分失败，请重试');
        } finally {
          setLoading(false);
        }
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return { text: 'text-green-400', bg: 'from-green-500 to-emerald-500', ring: 'stroke-green-400' };
    if (score >= 60) return { text: 'text-amber-400', bg: 'from-amber-500 to-yellow-500', ring: 'stroke-amber-400' };
    return { text: 'text-red-400', bg: 'from-red-500 to-rose-500', ring: 'stroke-red-400' };
  };

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
            <Mic className="w-6 h-6 text-pink-400" />
            AI 语音评测
          </h1>
          <p className="text-sm text-gray-500">测试你的发音准确度</p>
        </div>
      </div>

      {selectedWord && (
        <div className="glass-card rounded-3xl p-8 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold text-white mb-2 font-display">{selectedWord.word}</h2>
            <p className="text-lg text-gray-400 mb-1">{selectedWord.phonetic}</p>
            <p className="text-sm text-violet-300">{selectedWord.meaning}</p>
          </div>

          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={() => speakWord(selectedWord.word)}
              className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 text-sm"
            >
              <Volume2 className="w-4 h-4" />
              听发音
            </button>
            <button
              onClick={pickRandomWord}
              className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              换一个
            </button>
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-red-500/20 border-2 border-red-500/50 animate-pulse'
                  : 'bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-2 border-pink-500/30 hover:scale-105'
              }`}
            >
              {isRecording ? (
                <MicOff className="w-8 h-8 text-red-400" />
              ) : (
                <Mic className="w-8 h-8 text-pink-400" />
              )}
              {isRecording && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
              )}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500">
            {isRecording ? '正在聆听...' : '点击按钮开始录音'}
          </p>
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

      {recognizedText && !result && !loading && (
        <div className="glass-card rounded-2xl p-5 mb-6">
          <p className="text-sm text-gray-400 mb-1">识别结果</p>
          <p className="text-lg text-white font-mono">{recognizedText}</p>
        </div>
      )}

      {loading && (
        <div className="glass-card rounded-2xl p-8 mb-6 text-center">
          <Loader2 className="w-8 h-8 text-pink-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">正在评测发音...</p>
        </div>
      )}

      {result && (
        <div className="glass-card rounded-3xl p-8 mb-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-36 h-36 mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="54" fill="none"
                  className={getScoreColor(result.score).ring}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (result.score / 100) * circumference}
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${getScoreColor(result.score).text}`}>
                  {result.score}
                </span>
                <span className="text-xs text-gray-500">分</span>
              </div>
            </div>
            <p className="text-gray-300 text-center">{result.feedback}</p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] mb-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">目标单词</p>
                <p className="text-white font-bold">{result.target}</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">你读的是</p>
                <p className={`font-bold ${result.similarity >= 0.7 ? 'text-green-400' : 'text-red-400'}`}>
                  {result.recognized}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setResult(null); setRecognizedText(''); }}
              className="flex-1 py-3 rounded-xl bg-white/5 text-white font-semibold text-sm border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              再试一次
            </button>
            <button
              onClick={pickRandomWord}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-pink-500/25 transition-all"
            >
              换一个词
            </button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-3">评测记录</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <span className="text-white text-sm font-bold">{item.word}</span>
                  <span className="text-gray-500 text-xs ml-2">→ {item.text}</span>
                </div>
                <span className={`text-sm font-bold ${getScoreColor(item.score).text}`}>
                  {item.score}分
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPronunciationPage;
