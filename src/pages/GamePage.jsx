import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Volume2, Check, ArrowRight, RotateCcw, Home } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { gameModes } from '../data/words';

const GamePage = () => {
  const { mode } = useParams();
  const navigate = useNavigate();
  const { gameState, startGame, submitAnswer, finishGame, resetGame, progress } = useGame();

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const modeInfo = gameModes.find(m => m.id === mode);

  useEffect(() => {
    if (mode && modeInfo) {
      startGame(mode);
    }
    return () => {
      resetGame();
    };
  }, [mode]);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isFinished) {
      setTimeLeft(30);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleAnswer(null);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState.currentIndex, gameState.isPlaying, gameState.isFinished]);

  const speakWord = useCallback((text) => {
    if ('speechSynthesis' in window && !isSpeaking) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, [isSpeaking]);

  useEffect(() => {
    if (mode === 'listen-identify' || mode === 'spelling-challenge') {
      const currentQuestion = gameState.questions[gameState.currentIndex];
      if (currentQuestion) {
        setTimeout(() => speakWord(currentQuestion.word), 500);
      }
    }
  }, [gameState.currentIndex, mode]);

  const handleAnswer = (answer) => {
    if (showResult) return;

    const currentQuestion = gameState.questions[gameState.currentIndex];
    if (!currentQuestion) return;

    let selected = answer;
    if (mode === 'spelling-challenge') {
      selected = answer.toLowerCase().trim();
      const correct = currentQuestion.correctAnswer.toLowerCase().trim();
      if (selected !== correct) {
        selected = answer;
      }
    }

    const correct = submitAnswer(selected !== null ? selected : '');
    setSelectedAnswer(selected);
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setTimeout(() => {
        setShowResult(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimeLeft(30);
      }, 1000);
    } else {
      setTimeout(() => {
        setShowResult(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimeLeft(30);
      }, 1500);
    }
  };

  const handleKeyPress = (e) => {
    const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3 };
    if (keyMap[e.key] !== undefined && !showResult) {
      const currentQuestion = gameState.questions[gameState.currentIndex];
      if (currentQuestion) {
        handleAnswer(currentQuestion.options[keyMap[e.key]]);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showResult, gameState.currentIndex]);

  const getScore = () => {
    const correctCount = gameState.answers.filter(a => a.isCorrect).length;
    const accuracy = Math.round((correctCount / gameState.answers.length) * 100);
    return { correctCount, accuracy };
  };

  if (!gameState.isPlaying && !gameState.isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">正在加载游戏...</p>
        </div>
      </div>
    );
  }

  if (gameState.isFinished) {
    const { correctCount, accuracy } = getScore();
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full glass rounded-2xl p-8 text-center animate-fade-in">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            accuracy >= 80 ? 'bg-green-500/20' : 
            accuracy >= 60 ? 'bg-yellow-500/20' : 'bg-red-500/20'
          }`}>
            <span className="text-5xl">
              {accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '💪'}
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-2">本轮结束！</h1>
          <p className="text-gray-400 mb-6">你选择了「{modeInfo?.name}」模式</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="glass rounded-xl p-4">
              <div className="text-3xl font-display font-bold text-gradient">{correctCount}</div>
              <div className="text-sm text-gray-400">正确题数</div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="text-3xl font-display font-bold text-gradient">{accuracy}%</div>
              <div className="text-sm text-gray-400">正确率</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                finishGame();
                startGame(mode);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-primary rounded-xl font-bold btn-hover"
            >
              <RotateCcw className="w-5 h-5" />
              <span>再来一轮</span>
            </button>
            <button
              onClick={() => {
                finishGame();
                navigate('/');
              }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 glass rounded-xl font-bold btn-hover"
            >
              <Home className="w-5 h-5" />
              <span>返回首页</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = gameState.questions[gameState.currentIndex];
  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass-strong py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                resetGame();
                navigate('/');
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div>
              <div className="text-sm text-gray-400">{modeInfo?.name}</div>
              <div className="font-bold">
                {gameState.currentIndex + 1} / {gameState.questions.length}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className={`font-display font-bold text-2xl ${
              timeLeft <= 10 ? 'text-red-400' : 'text-gray-300'
            }`}>
              {timeLeft}s
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">得分</div>
              <div className="font-display font-bold text-xl text-gradient">{gameState.score}</div>
            </div>
            {gameState.combo > 0 && (
              <div className="px-3 py-1 rounded-full bg-gradient-primary text-sm font-bold">
                {gameState.combo} 连
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="glass rounded-2xl p-12 mb-8 text-center relative">
            {(mode === 'word-recognition' || mode === 'meaning-match') && (
              <>
                <div className="text-6xl md:text-7xl font-word font-bold mb-4 animate-float">
                  {mode === 'word-recognition' ? currentQuestion.word : currentQuestion.meaning}
                </div>
                {mode === 'word-recognition' && (
                  <div className="text-2xl text-gray-400 mb-4">{currentQuestion.phonetic}</div>
                )}
                {(mode === 'listen-identify' || mode === 'spelling-challenge') && (
                  <div className="text-2xl text-gray-400 mb-4">
                    <button
                      onClick={() => speakWord(currentQuestion.word)}
                      className="inline-flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <Volume2 className={`w-6 h-6 ${isSpeaking ? 'animate-pulse' : ''}`} />
                      <span>点击播放发音</span>
                    </button>
                  </div>
                )}
              </>
            )}

            {mode === 'spelling-challenge' && (
              <div className="mt-4">
                <input
                  type="text"
                  value={selectedAnswer || ''}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAnswer(selectedAnswer)}
                  placeholder="输入单词拼写..."
                  className="w-full max-w-md px-6 py-3 bg-dark-800 border-2 border-primary-500/50 rounded-xl text-center text-2xl font-word focus:outline-none focus:border-primary-500 transition-colors"
                  autoFocus
                />
                <button
                  onClick={() => handleAnswer(selectedAnswer)}
                  className="mt-4 px-8 py-3 bg-gradient-primary rounded-xl font-bold btn-hover"
                >
                  确认
                </button>
              </div>
            )}
          </div>

          {mode !== 'spelling-challenge' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrectOption = option === currentQuestion.correctAnswer;
                const showCorrect = showResult && isCorrectOption;
                const showWrong = showResult && isSelected && !isCorrectOption;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={showResult}
                    className={`relative p-4 rounded-xl font-medium text-left transition-all ${
                      showCorrect
                        ? 'bg-green-500 border-2 border-green-500 correct-animation'
                        : showWrong
                        ? 'bg-red-500 border-2 border-red-500 wrong-animation'
                        : isSelected
                        ? 'bg-primary-500 border-2 border-primary-500'
                        : 'glass hover:bg-white/20 border-2 border-transparent hover:border-primary-500/50'
                    } ${showResult ? 'cursor-not-allowed' : 'btn-hover'}`}
                  >
                    <span className="text-sm text-gray-400 absolute top-2 left-3">{(index + 1).toString()}</span>
                    <span className="block mt-2">{option}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-8 text-center text-sm text-gray-400">
            按键盘 <span className="px-2 py-1 bg-dark-800 rounded mx-1">1</span> 
            <span className="px-2 py-1 bg-dark-800 rounded mx-1">2</span> 
            <span className="px-2 py-1 bg-dark-800 rounded mx-1">3</span> 
            <span className="px-2 py-1 bg-dark-800 rounded mx-1">4</span> 快速作答
          </div>
        </div>
      </main>
    </div>
  );
};

export default GamePage;
