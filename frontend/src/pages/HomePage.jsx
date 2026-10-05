import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Swords, Star, Trophy, Heart, Zap, Crown, Skull, Lock,
  Sparkles, TrendingUp, Target, Flame, BookOpen, ChevronRight,
  Gift, CheckCircle2, Clock, Sword, Shield, Cat, Layers,
  Gamepad2, Brain, Compass, Rocket, Gem, ArrowRight,
  Users, BarChart3, Medal, Volume2, Palette, Wand2,
  ChevronDown, Play, Award, BookMarked, Dumbbell
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { levels } from '../data/gameData';
import { useScrollReveal, useScrollRevealMultiple } from '../hooks/useScrollReveal';

const HomePage = () => {
  const navigate = useNavigate();
  const { player, startBattle, checkIn } = useGame();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInResult, setCheckInResult] = useState(null);

  useScrollRevealMultiple('.scroll-reveal', { once: true });
  useScrollRevealMultiple('.scroll-reveal-left', { once: true });
  useScrollRevealMultiple('.scroll-reveal-right', { once: true });
  useScrollRevealMultiple('.scroll-reveal-scale', { once: true });

  const handleStartBattle = (level) => {
    if (player.level < level.requiredLevel) return;
    startBattle(level.id);
    navigate('/battle');
  };

  const isLevelUnlocked = (level) => player.level >= level.requiredLevel;
  const getLevelStatus = (level) => {
    if (player.defeatedBosses.includes(level.id)) return 'defeated';
    if (player.completedLevels.includes(level.id)) return 'completed';
    return 'available';
  };

  const handleCheckIn = () => {
    const result = checkIn();
    if (result && result.success) {
      setCheckInResult(result);
      setShowCheckIn(true);
      setTimeout(() => setShowCheckIn(false), 3000);
    }
  };

  const todayTasks = player.dailyTasks?.filter(t => !t.claimed).slice(0, 3) || [];
  const completedTasks = player.dailyTasks?.filter(t => t.completed && !t.claimed).length || 0;

  const features = [
    {
      icon: Gamepad2,
      title: 'RPG冒险战斗',
      desc: '将背单词融入RPG战斗，答对攻击敌人，答错受到反击，让学习充满刺激感',
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-500/10',
      textColor: 'text-violet-400'
    },
    {
      icon: Brain,
      title: '智能记忆系统',
      desc: '基于艾宾浩斯遗忘曲线，自动安排复习计划，让单词记忆更牢固',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400'
    },
    {
      icon: Layers,
      title: '卡牌收集',
      desc: '击败敌人获得单词卡牌，N/R/SR/SSR稀有度，收集控的最爱',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-400'
    },
    {
      icon: Shield,
      title: '装备养成',
      desc: '武器、防具、饰品三槽位装备系统，打造属于你的最强角色',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-400'
    },
    {
      icon: Cat,
      title: '宠物伙伴',
      desc: '解锁灵狐、战狼、幼龙等宠物伙伴，陪你一起战斗成长',
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-pink-500/10',
      textColor: 'text-pink-400'
    },
    {
      icon: Zap,
      title: '技能树',
      desc: '解锁强力一击、快速恢复等技能，让战斗更加得心应手',
      color: 'from-red-500 to-orange-600',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-400'
    }
  ];

  const advantages = [
    {
      icon: Trophy,
      value: '10,000+',
      label: '词汇量覆盖',
      desc: '涵盖四六级、雅思、托福、商务英语'
    },
    {
      icon: Users,
      value: '50,000+',
      label: '活跃玩家',
      desc: '与全球学习者一起竞技'
    },
    {
      icon: BarChart3,
      value: '95%',
      label: '记忆留存率',
      desc: '科学的复习算法提升记忆效果'
    },
    {
      icon: Medal,
      value: '30+',
      label: '成就徽章',
      desc: '丰富的成就系统激励持续学习'
    }
  ];

  const news = [
    {
      tag: '新功能',
      tagColor: 'bg-violet-500/20 text-violet-400',
      title: '宠物系统正式上线',
      date: '2026-05-27',
      desc: '解锁你的第一个宠物伙伴，让它陪你一起冒险！'
    },
    {
      tag: '活动',
      tagColor: 'bg-amber-500/20 text-amber-400',
      title: '双倍经验周末',
      date: '2026-05-25',
      desc: '本周末所有战斗获得双倍经验值，快来升级吧！'
    },
    {
      tag: '更新',
      tagColor: 'bg-emerald-500/20 text-emerald-400',
      title: '新增雅思词库',
      date: '2026-05-20',
      desc: '雅思考试高频词汇已加入词库，备考更高效'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* 英雄区域 - 大幅增强视觉效果 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-900/50 via-fuchsia-900/40 to-amber-900/30 border border-violet-500/20 p-8 md:p-10 nebula-bg particles-container">
        {/* 浮动装饰元素 */}
        <div className="absolute top-10 left-10 text-4xl float-animation opacity-20">✦</div>
        <div className="absolute top-20 right-20 text-3xl float-animation-delayed opacity-15">⭐</div>
        <div className="absolute bottom-16 left-1/4 text-2xl float-animation-slow opacity-20">◆</div>
        <div className="absolute bottom-10 right-1/3 text-3xl float-horizontal opacity-15">🌟</div>

        {/* 背景光晕 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-medium float-animation">
                  ✨ 全新版本 v2.0
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gradient font-display mb-2">
                欢迎回来，{player.name}
              </h1>
              <p className="text-gray-400 text-sm md:text-base max-w-lg">
                今天也是充满单词力量的一天！继续你的冒险，解锁更多关卡，收集稀有卡牌。
              </p>

              {/* 快捷操作按钮 */}
              <div className="flex flex-wrap gap-3 mt-5">
                <button
                  onClick={() => navigate('/categories')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-violet-500/30 btn-hover ion-diffuse"
                >
                  <Play className="w-4 h-4" />
                  开始冒险
                </button>
                <button
                  onClick={handleCheckIn}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ion-diffuse-gold ${
                    player.dailyCheckIn?.lastCheckIn === new Date().toISOString().split('T')[0]
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/30 btn-hover'
                  }`}
                >
                  <Gift className="w-4 h-4" />
                  {player.dailyCheckIn?.lastCheckIn === new Date().toISOString().split('T')[0]
                    ? '已签到'
                    : '每日签到'}
                </button>
              </div>
            </div>

            {/* 右侧角色展示 */}
            <div className="hidden md:flex flex-col items-center">
              <div className="relative">
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-amber-500 flex items-center justify-center text-5xl shadow-lg shadow-violet-500/30 float-animation">
                  🎮
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-white shadow-lg animate-bounce">
                  Lv.{player.level}
                </div>
              </div>
              <div className="mt-3 text-center">
                <div className="text-sm font-bold text-white">{player.name}</div>
                <div className="text-xs text-gray-400">单词冒险家</div>
              </div>
            </div>
          </div>

          {/* 快捷统计 - 增强视觉效果 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {[
              { icon: BookOpen, label: '已学单词', value: player.learnedWords?.length || 0, color: 'text-violet-400', bg: 'bg-violet-500/10' },
              { icon: Target, label: '今日正确', value: player.studyStats?.todayCorrect || 0, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { icon: Flame, label: '连胜天数', value: `${player.dailyCheckIn?.streak || 0}天`, color: 'text-orange-400', bg: 'bg-orange-500/10' },
              { icon: Clock, label: '学习时长', value: `${Math.floor((player.studyStats?.todayStudyTime || 0) / 60)}分`, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`glass-card rounded-xl p-3 hover:bg-violet-500/5 transition-all cursor-default hover:-translate-y-1 stagger-${index + 1}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                  </div>
                  <span className="text-xs text-gray-400">{stat.label}</span>
                </div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 特色功能介绍 */}
      <div className="scroll-reveal">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400 float-animation" />
            特色功能
          </h2>
          <button
            onClick={() => navigate('/categories')}
            className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
          >
            探索更多 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`scroll-reveal stagger-${index + 1} glass-card rounded-2xl p-5 group hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-violet-500/10 cursor-pointer`}
              onClick={() => {
                const paths = {
                  'RPG冒险战斗': '/',
                  '智能记忆系统': '/wordbook',
                  '卡牌收集': '/cards',
                  '装备养成': '/equipment',
                  '宠物伙伴': '/pets',
                  '技能树': '/skills'
                };
                navigate(paths[feature.title] || '/');
              }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1 group-hover:text-violet-300 transition-colors">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>了解更多</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 产品优势 */}
      <div className="scroll-reveal">
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400 float-animation" />
          为什么选择单词冒险
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {advantages.map((adv, index) => (
            <div
              key={adv.label}
              className={`scroll-reveal-scale stagger-${index + 1} glass-card rounded-2xl p-5 text-center hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-3 float-animation" style={{ animationDelay: `${index * 0.2}s` }}>
                <adv.icon className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-gradient-gold mb-1">{adv.value}</div>
              <div className="text-sm font-medium text-white mb-1">{adv.label}</div>
              <div className="text-xs text-gray-500">{adv.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 每日任务 + 快速入口 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 scroll-reveal">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-400 float-animation" />
              每日任务
            </h2>
            <span className="text-sm text-gray-400">
              {completedTasks}/{player.dailyTasks?.length || 0} 完成
            </span>
          </div>
          <div className="space-y-3">
            {todayTasks.map((task, index) => (
              <div
                key={task.id}
                className={`scroll-reveal stagger-${index + 1} glass-card rounded-xl p-4 flex items-center justify-between ${
                  task.completed ? 'border-green-500/30' : ''
                } hover:border-violet-500/30 transition-all hover:-translate-x-1`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    task.completed ? 'bg-green-500/20' : 'bg-violet-500/10'
                  }`}>
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <Target className="w-5 h-5 text-violet-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-white">{task.name}</div>
                    <div className="text-xs text-gray-400">{task.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-gray-400">{task.progress}/{task.target}</div>
                    <div className="w-24 h-1.5 bg-white/5 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          task.completed ? 'bg-green-500' : 'bg-violet-500'
                        }`}
                        style={{ width: `${(task.progress / task.target) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-amber-400 font-medium">
                    +{task.reward?.gold || 0}💰
                  </div>
                </div>
              </div>
            ))}
            {todayTasks.length === 0 && (
              <div className="glass-card rounded-xl p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3 float-animation" />
                <p className="text-gray-400">今日任务已全部完成！</p>
              </div>
            )}
          </div>
        </div>

        <div className="scroll-reveal-right">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400 float-animation" />
            快速入口
          </h2>
          <div className="space-y-3">
            {[
              { path: '/wordbook', icon: BookOpen, color: 'bg-blue-500/10', iconColor: 'text-blue-400', title: '单词本', desc: `${player.wrongWords?.length || 0} 个待复习` },
              { path: '/shop', icon: Trophy, color: 'bg-amber-500/10', iconColor: 'text-amber-400', title: '商店', desc: `${player.gold} 金币可用` },
              { path: '/leaderboard', icon: Crown, color: 'bg-purple-500/10', iconColor: 'text-purple-400', title: '排行榜', desc: `${player.rankPoints} 积分` },
              { path: '/stats', icon: TrendingUp, color: 'bg-emerald-500/10', iconColor: 'text-emerald-400', title: '学习统计', desc: '查看学习进度' },
            ].map((item, index) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`scroll-reveal-left stagger-${index + 1} w-full glass-card rounded-xl p-4 flex items-center gap-3 hover:bg-violet-500/10 transition-all text-left group hover:-translate-x-1 hover:border-violet-500/30`}
              >
                <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-white">{item.title}</div>
                  <div className="text-xs text-gray-400">{item.desc}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 最新动态 */}
      <div className="scroll-reveal">
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-blue-400 float-animation" />
          最新动态
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {news.map((item, index) => (
            <div
              key={item.title}
              className={`scroll-reveal stagger-${index + 1} glass-card rounded-2xl p-5 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-2 cursor-pointer group`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.tagColor}`}>
                  {item.tag}
                </span>
                <span className="text-xs text-gray-500">{item.date}</span>
              </div>
              <h3 className="font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>查看详情</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 冒险地图 */}
      <div className="scroll-reveal">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Sword className="w-5 h-5 text-red-400 float-animation" />
          冒险地图
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {levels.map((level, index) => {
            const unlocked = isLevelUnlocked(level);
            const status = getLevelStatus(level);
            const isBoss = level.boss;

            return (
              <div
                key={level.id}
                onClick={() => unlocked && handleStartBattle(level)}
                className={`scroll-reveal stagger-${index + 1} relative glass-card rounded-2xl overflow-hidden transition-all duration-300 ${
                  unlocked
                    ? status === 'defeated'
                      ? 'border-green-500/30 hover:border-green-500/50'
                      : 'border-violet-500/30 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 cursor-pointer hover:-translate-y-2'
                    : 'border-white/5 opacity-50 cursor-not-allowed'
                }`}
              >
                {isBoss && (
                  <div className="absolute top-3 right-3 bg-gradient-to-l from-red-600 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 z-10 ion-diffuse-red">
                    <Skull className="w-3 h-3" />
                    BOSS
                  </div>
                )}

                {status === 'defeated' && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    ✓ 已通关
                  </div>
                )}

                <div className={`${isBoss ? 'h-40' : 'h-32'} relative flex items-center justify-center bg-gradient-to-b from-white/5 to-transparent`}>
                  <div className={`text-7xl ${status === 'defeated' ? 'grayscale opacity-40' : ''} ${unlocked ? 'float-animation' : ''}`}>
                    {level.enemy.image}
                  </div>

                  {!unlocked && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <div className="text-center">
                        <Lock className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                        <div className="text-gray-400 font-bold text-sm">
                          需要 Lv.{level.requiredLevel}
                        </div>
                      </div>
                    </div>
                  )}

                  {status === 'defeated' && (
                    <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                      <div className="bg-green-500 rounded-full p-3 shadow-lg shadow-green-500/30 scale-in">
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white">{level.name}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(level.difficulty)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-400 text-xs mb-3">{level.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1 text-violet-400">
                        <Zap className="w-3.5 h-3.5" />
                        <span>{level.reward.exp} EXP</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>{level.reward.gold}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {level.wordsPerLevel} 题
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA 区域 */}
      <div className="scroll-reveal">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-900/40 via-fuchsia-900/30 to-amber-900/20 border border-violet-500/20 p-8 text-center nebula-bg">
          <div className="absolute top-5 left-10 text-3xl float-animation opacity-20">✦</div>
          <div className="absolute bottom-5 right-10 text-2xl float-animation-delayed opacity-15">⭐</div>

          <h2 className="text-2xl font-bold text-gradient font-display mb-3">
            准备好开始你的单词冒险了吗？
          </h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            每一道题目都是一次战斗，每一个单词都是一份力量。加入数万冒险者，一起征服单词大陆！
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('/categories')}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold hover:shadow-lg hover:shadow-violet-500/30 btn-hover ion-diffuse"
            >
              立即开始
            </button>
            <button
              onClick={() => navigate('/leaderboard')}
              className="px-8 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/15 transition-all border border-white/10 hover:border-violet-500/30"
            >
              查看排行榜
            </button>
          </div>
        </div>
      </div>

      {/* 签到成功提示 */}
      {showCheckIn && checkInResult && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-violet-500/30 flex items-center gap-3 animate-bounce">
            <Gift className="w-5 h-5" />
            <div>
              <div className="font-bold">签到成功！</div>
              <div className="text-sm opacity-90">
                获得 {checkInResult.reward} 金币，连续 {checkInResult.streak} 天
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
