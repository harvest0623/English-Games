import { useNavigate } from 'react-router-dom';
import { Layers, BarChart3, Brain, PenLine, MessageCircle, Mic, FileText, Sparkles } from 'lucide-react';

const features = [
  {
    title: '词根词缀分析',
    description: '深入解析单词的词根、前缀和后缀，理解构词规律',
    icon: Layers,
    color: 'violet',
    route: '/ai/analysis',
    gradient: 'from-violet-500/20 to-purple-500/20',
    iconColor: 'text-violet-400',
    hoverShadow: 'hover:shadow-violet-500/10',
  },
  {
    title: 'AI 学习报告',
    description: '基于你的学习数据，生成个性化学习分析报告',
    icon: BarChart3,
    color: 'blue',
    route: '/ai/report',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
    hoverShadow: 'hover:shadow-blue-500/10',
  },
  {
    title: 'AI 智能出题',
    description: 'AI 根据你的水平智能生成练习题目',
    icon: Brain,
    color: 'amber',
    route: '/ai/quiz',
    gradient: 'from-amber-500/20 to-yellow-500/20',
    iconColor: 'text-amber-400',
    hoverShadow: 'hover:shadow-amber-500/10',
  },
  {
    title: 'AI 造句练习',
    description: '用 AI 辅助造句，掌握单词在语境中的用法',
    icon: PenLine,
    color: 'green',
    route: '/ai/sentence',
    gradient: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-400',
    hoverShadow: 'hover:shadow-green-500/10',
  },
  {
    title: 'AI 对话练习',
    description: '与 AI 进行英语对话，提升口语表达能力',
    icon: MessageCircle,
    color: 'cyan',
    route: '/ai/chat',
    gradient: 'from-cyan-500/20 to-teal-500/20',
    iconColor: 'text-cyan-400',
    hoverShadow: 'hover:shadow-cyan-500/10',
  },
  {
    title: 'AI 语音评测',
    description: 'AI 实时评测你的发音，纠正发音错误',
    icon: Mic,
    color: 'pink',
    route: '/ai/pronunciation',
    gradient: 'from-pink-500/20 to-rose-500/20',
    iconColor: 'text-pink-400',
    hoverShadow: 'hover:shadow-pink-500/10',
  },
  {
    title: 'AI 作文批改',
    description: 'AI 批改英语作文，提供语法和表达优化建议',
    icon: FileText,
    color: 'orange',
    route: '/ai/essay',
    gradient: 'from-orange-500/20 to-amber-500/20',
    iconColor: 'text-orange-400',
    hoverShadow: 'hover:shadow-orange-500/10',
  },
];

const AIHubPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gradient font-display mb-3 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-violet-400" />
          AI 智能学习
        </h1>
        <p className="text-gray-500">利用 AI 技术，让英语学习更高效</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <button
              key={feature.route}
              onClick={() => navigate(feature.route)}
              className={`glass-card rounded-2xl p-6 text-left hover:-translate-y-1 hover:shadow-xl ${feature.hoverShadow} transition-all group`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${feature.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{feature.description}</p>
              <div className={`text-sm font-semibold ${feature.iconColor} group-hover:translate-x-1 transition-transform`}>
                开始 →
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AIHubPage;
