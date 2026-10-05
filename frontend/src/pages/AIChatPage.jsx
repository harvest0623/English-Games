import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Send, Volume2, Trash2, ArrowLeft, Utensils, Plane, Building2, Briefcase, ShoppingBag, Stethoscope, Sparkles, Bot, User, AlertTriangle } from 'lucide-react';
import { aiApi } from '../services/api';

const scenarios = [
  { id: 'free', label: '自由对话', icon: Sparkles, description: '自由练习英语口语', color: 'from-violet-500/20 to-fuchsia-500/20', textColor: 'text-violet-400' },
  { id: 'restaurant', label: '餐厅点餐', sub: 'At a Restaurant', icon: Utensils, description: '学习在餐厅用英语点餐', color: 'from-amber-500/20 to-orange-500/20', textColor: 'text-amber-400' },
  { id: 'airport', label: '机场问路', sub: 'At the Airport', icon: Plane, description: '学习在机场用英语问路', color: 'from-blue-500/20 to-cyan-500/20', textColor: 'text-blue-400' },
  { id: 'hotel', label: '酒店入住', sub: 'Hotel Check-in', icon: Building2, description: '学习在酒店用英语办理入住', color: 'from-green-500/20 to-emerald-500/20', textColor: 'text-green-400' },
  { id: 'interview', label: '面试', sub: 'Job Interview', icon: Briefcase, description: '模拟英语面试场景', color: 'from-rose-500/20 to-pink-500/20', textColor: 'text-rose-400' },
  { id: 'shopping', label: '购物', sub: 'Shopping', icon: ShoppingBag, description: '学习在商店用英语购物', color: 'from-purple-500/20 to-indigo-500/20', textColor: 'text-purple-400' },
  { id: 'hospital', label: '医院看病', sub: 'At the Hospital', icon: Stethoscope, description: '学习在医院用英语看病', color: 'from-red-500/20 to-rose-500/20', textColor: 'text-red-400' }
];

const AIChatPage = () => {
  const navigate = useNavigate();
  const [activeScenario, setActiveScenario] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (activeScenario) {
      inputRef.current?.focus();
    }
  }, [activeScenario]);

  const startScenario = (scenario) => {
    setActiveScenario(scenario);
    setMessages([]);
    setError(null);

    const greeting = getScenarioGreeting(scenario);
    setMessages([{ id: Date.now(), role: 'ai', text: greeting }]);
  };

  const getScenarioGreeting = (scenario) => {
    const map = {
      free: "Hi! I'm your English conversation partner. Feel free to chat with me about anything! What would you like to talk about?",
      restaurant: "Welcome to The Golden Fork! 🍽️ I'm your server today. Would you like to see the menu, or do you already know what you'd like to order?",
      airport: "Hello! Welcome to the international terminal. ✈️ I'm here to help you navigate the airport. Where would you like to go?",
      hotel: "Good afternoon! Welcome to Grand Hotel. 🏨 How may I assist you today? Do you have a reservation?",
      interview: "Good morning! Thank you for coming in today. Please, have a seat. Let's begin with you telling me a little about yourself.",
      shopping: "Hi there! Welcome to the store! 👋 Can I help you find anything today? We have some great items on sale.",
      hospital: "Hello, I'm Dr. Smith. Welcome to the clinic. 🏥 What seems to be the problem today? How can I help you?"
    };
    return map[scenario.id] || map.free;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const history = [...messages, userMessage].map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.text
      }));

      const result = await aiApi.chat(currentInput, history, activeScenario?.id);
      const aiText = result.reply || result.data?.reply || result.message || result.data?.message || '';
      setMessages(prev => [...prev, { id: Date.now(), role: 'ai', text: aiText }]);
    } catch (err) {
      console.error('AI 对话失败:', err);
      setError('AI 服务未配置或请求失败，请检查后端 AI API 设置。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    if (!activeScenario) return;
    const greeting = getScenarioGreeting(activeScenario);
    setMessages([{ id: Date.now(), role: 'ai', text: greeting }]);
    setError(null);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const currentScenario = scenarios.find(s => s.id === activeScenario?.id);

  if (!activeScenario) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gradient font-display mb-3 flex items-center justify-center gap-3">
            <MessageCircle className="w-8 h-8 text-violet-400" />
            AI 对话练习
          </h1>
          <p className="text-gray-500">与 AI 外教进行英语情景对话</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {scenarios.map(scenario => {
            const Icon = scenario.icon;
            return (
              <button
                key={scenario.id}
                onClick={() => startScenario(scenario)}
                className="glass-card rounded-2xl p-6 text-left hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${scenario.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${scenario.textColor}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{scenario.label}</h3>
                {scenario.sub && (
                  <p className="text-xs text-gray-500 mb-2">{scenario.sub}</p>
                )}
                <p className="text-sm text-gray-500">{scenario.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="glass-card rounded-2xl p-4 mb-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScenario(null)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentScenario?.color || 'from-violet-500/20 to-fuchsia-500/20'} flex items-center justify-center`}>
            {currentScenario && <currentScenario.icon className={`w-5 h-5 ${currentScenario?.textColor || 'text-violet-400'}`} />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{currentScenario?.label || '对话'}</h3>
            <p className="text-xs text-gray-500">AI 外教</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={clearChat}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            title="清空对话"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveScenario(null)}
            className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 border border-white/10 transition-all"
          >
            切换场景
          </button>
        </div>
      </div>

      {error && (
        <div className="glass-card rounded-xl p-4 mb-4 border border-amber-500/20 flex items-start gap-3 shrink-0">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-300 font-semibold">AI 服务提示</p>
            <p className="text-xs text-gray-400 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'ai'
                ? 'bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30'
                : 'bg-gradient-to-br from-purple-500/30 to-indigo-500/30'
            }`}>
              {msg.role === 'ai' ? (
                <Bot className="w-4 h-4 text-violet-400" />
              ) : (
                <User className="w-4 h-4 text-purple-400" />
              )}
            </div>
            <div className={`max-w-[75%] group relative ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'ai'
                  ? 'bg-white/[0.05] text-gray-200 border border-white/[0.05]'
                  : 'bg-gradient-to-r from-violet-600/80 to-fuchsia-600/80 text-white'
              }`}>
                {msg.text}
              </div>
              {msg.role === 'ai' && (
                <button
                  onClick={() => speakText(msg.text)}
                  className="absolute -right-9 top-2 p-1.5 rounded-lg bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-violet-400" />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-white/[0.05] border border-white/[0.05]">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="glass-card rounded-2xl p-3 shrink-0">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入你的消息... (Enter 发送)"
            rows={1}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
