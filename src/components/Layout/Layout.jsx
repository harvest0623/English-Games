import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import {
  Swords, Star, Trophy, Heart, User, Layers, ShoppingBag,
  BookOpen, BarChart3, Medal, Zap, Cat, Shield, Grid3X3,
  ChevronDown, X, Menu, Sparkles, Settings, LogOut,
  UserCircle, LogIn, UserPlus
} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { player, logout } = useGame();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarRef = useRef(null);

  const navItems = [
    { path: '/', label: '首页', icon: Swords },
    { path: '/categories', label: '词库', icon: Grid3X3 },
    { path: '/wordbook', label: '单词本', icon: BookOpen },
    { path: '/cards', label: '卡牌', icon: Layers },
    { path: '/equipment', label: '装备', icon: Shield },
    { path: '/skills', label: '技能', icon: Zap },
    { path: '/pets', label: '宠物', icon: Cat },
    { path: '/shop', label: '商店', icon: ShoppingBag },
    { path: '/stats', label: '统计', icon: BarChart3 },
    { path: '/leaderboard', label: '排行', icon: Medal },
    { path: '/profile', label: '我的', icon: User },
  ];

  const isActive = (path) => location.pathname === path;
  const isLoggedIn = player.user?.isLoggedIn;
  const expPercent = (player.exp / (player.level * 100)) * 100;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAvatarMenuAction = (action) => {
    setAvatarMenuOpen(false);
    setMobileMenuOpen(false);
    if (action === 'login') navigate('/login');
    else if (action === 'register') navigate('/register');
    else if (action === 'profile') navigate('/profile');
    else if (action === 'settings') navigate('/settings');
    else if (action === 'logout') logout();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-all">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gradient font-display tracking-wide">
                  单词冒险
                </h1>
                <p className="text-[10px] text-gray-500 -mt-0.5">Word Quest RPG</p>
              </div>
            </Link>

            {/* 桌面端导航 */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.slice(0, 8).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.path)
                        ? 'bg-violet-500/20 text-violet-300'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* 右侧：玩家状态 + 头像 */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
                  <Star className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-xs font-bold text-violet-300">Lv.{player.level}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300">{player.gold}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                  <Heart className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-xs font-bold text-red-300">{player.currentHp}/{player.maxHp}</span>
                </div>
              </div>

              {/* 头像按钮 + 下拉菜单 */}
              <div className="relative" ref={avatarRef}>
                <button
                  onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                  className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center overflow-hidden bg-gray-600 hover:border-violet-400 transition-colors"
                >
                  {player.user?.avatar ? (
                    <img src={player.user.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-gray-300" />
                  )}
                </button>

                {/* 桌面端下拉菜单 */}
                {avatarMenuOpen && (
                  <div className="hidden lg:block absolute right-0 top-12 w-56 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-in">
                    {/* 用户信息头部 */}
                    <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center bg-gray-600 overflow-hidden">
                          {player.user?.avatar ? (
                            <img src={player.user.avatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{player.name}</div>
                          <div className="text-[11px] text-gray-400">
                            {isLoggedIn ? (player.user?.email || '已登录') : '未登录'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      {isLoggedIn ? (
                        <>
                          <button
                            onClick={() => handleAvatarMenuAction('profile')}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          >
                            <UserCircle className="w-4 h-4" />
                            个人中心
                          </button>
                          <button
                            onClick={() => handleAvatarMenuAction('settings')}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            设置
                          </button>
                          <div className="border-t border-white/5 my-1" />
                          <button
                            onClick={() => handleAvatarMenuAction('logout')}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            退出登录
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleAvatarMenuAction('login')}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          >
                            <LogIn className="w-4 h-4" />
                            登录
                          </button>
                          <button
                            onClick={() => handleAvatarMenuAction('register')}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          >
                            <UserPlus className="w-4 h-4" />
                            注册
                          </button>
                          <div className="border-t border-white/5 my-1" />
                          <button
                            onClick={() => handleAvatarMenuAction('settings')}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            设置
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 移动端菜单按钮 */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* 经验条 */}
          <div className="pb-2">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-gray-500">EXP</span>
              <span className="text-violet-400 font-medium">{player.exp}/{player.level * 100}</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${expPercent}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute right-0 top-16 bottom-0 w-64 bg-[#13131f] border-l border-white/5 p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* 移动端头像区域 - 菜单第一项 */}
            <div className="mb-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center bg-gray-600 overflow-hidden">
                  {player.user?.avatar ? (
                    <img src={player.user.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{player.name}</div>
                  <div className="text-[11px] text-gray-400">
                    {isLoggedIn ? (player.user?.email || '已登录') : '未登录'}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => handleAvatarMenuAction('profile')}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-violet-500/20 text-violet-300 text-xs font-medium hover:bg-violet-500/30 transition-colors"
                    >
                      <UserCircle className="w-3.5 h-3.5" />
                      个人中心
                    </button>
                    <button
                      onClick={() => handleAvatarMenuAction('logout')}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleAvatarMenuAction('login')}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-violet-500/20 text-violet-300 text-xs font-medium hover:bg-violet-500/30 transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      登录
                    </button>
                    <button
                      onClick={() => handleAvatarMenuAction('register')}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-gray-300 text-xs font-medium hover:bg-white/10 transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      注册
                    </button>
                  </>
                )}
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive(item.path)
                        ? 'bg-violet-500/20 text-violet-300'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* 设置入口 */}
              <div className="border-t border-white/5 my-2" />
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive('/settings')
                    ? 'bg-violet-500/20 text-violet-300'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>设置</span>
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* 主内容区 */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {children}
      </main>

      {/* 底部导航（移动端） */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5 z-50">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'text-violet-400'
                    : 'text-gray-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 底部间距（移动端） */}
      <div className="lg:hidden h-16" />
    </div>
  );
};

export default Layout;
