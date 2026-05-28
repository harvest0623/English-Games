import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useGame();
  const [form, setForm] = useState({ name: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);
  const [devPlatform, setDevPlatform] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = '请输入用户名';
    if (!form.password) newErrors.password = '请输入密码';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      login(form.name, form.password);
      setIsSubmitting(false);
      navigate('/');
    }, 600);
  };

  const handleSocialLogin = (platform) => {
    setDevPlatform(platform);
    setShowDevModal(true);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-[480px]">
        {/* 主卡片 */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#16162a] to-[#0f0f1e] border border-white/[0.06] shadow-2xl shadow-black/50">
          {/* 背景装饰 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[200px] bg-fuchsia-600/8 rounded-full blur-[80px] pointer-events-none" />

          {/* 顶部装饰条 */}
          <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-500" />

          <div className="relative px-6 pt-8 pb-8 md:px-10">
            {/* Logo + 标题 */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-amber-500 shadow-xl shadow-violet-500/25 mb-4 float-animation">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gradient font-display mb-2 tracking-wide">
                欢迎回来
              </h1>
              <p className="text-sm text-gray-500">
                登录你的单词冒险账号，继续探索
              </p>
            </div>

            {/* 表单 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 用户名 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <span className="iconfont icon-zhanghao text-violet-400 text-base" />
                  用户名
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="请输入用户名"
                    className={`w-full px-5 py-3 rounded-xl bg-white/[0.03] border text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-all duration-300 ${
                      errors.name ? 'border-red-500/40' : 'border-white/8'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              {/* 密码 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <span className="iconfont icon-mima text-amber-400 text-base" />
                  密码
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="请输入密码"
                    className={`w-full px-5 py-3 pr-12 rounded-xl bg-white/[0.03] border text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-all duration-300 ${
                      errors.password ? 'border-red-500/40' : 'border-white/8'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-3 h-3" /> {errors.password}
                  </p>
                )}
              </div>

              {/* 记住我 + 忘记密码 */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500/30" />
                  <span className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">记住我</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                  忘记密码？
                </Link>
              </div>

              {/* 登录按钮 */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 text-white font-bold text-sm hover:shadow-xl hover:shadow-violet-500/25 btn-hover transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  '登录'
                )}
              </button>
            </form>

            {/* 第三方登录 */}
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-xs text-gray-600 font-medium">或使用以下方式登录</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>
              <div className="flex items-center justify-center gap-10">
                <button
                  onClick={() => handleSocialLogin('微信')}
                  className="group flex items-center justify-center w-14 h-14 rounded-full bg-[#07C160] hover:bg-[#06a854] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#07C160]/30"
                >
                  <span className="iconfont icon-weixin text-2xl text-white" />
                </button>
                <button
                  onClick={() => handleSocialLogin('QQ')}
                  className="group flex items-center justify-center w-14 h-14 rounded-full bg-[#12B7F5] hover:bg-[#0ea3db] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#12B7F5]/30"
                >
                  <span className="iconfont icon-QQ text-2xl text-white" />
                </button>
                <button
                  onClick={() => handleSocialLogin('微博')}
                  className="group flex items-center justify-center w-14 h-14 rounded-full bg-[#E6162D] hover:bg-[#cc1328] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#E6162D]/30"
                >
                  <span className="iconfont icon-xinlangweibo text-2xl text-white" />
                </button>
              </div>
            </div>

            {/* 注册入口 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                还没有账号？{' '}
                <Link
                  to="/register"
                  className="text-violet-400 hover:text-violet-300 font-semibold transition-colors inline-flex items-center gap-1 hover:gap-2"
                >
                  立即注册
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 开发中提示弹框 */}
      {showDevModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDevModal(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#1e1e3a] to-[#141428] border border-white/[0.08] shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 mb-4">
                <span className="iconfont icon-gongjuxiang text-2xl text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">功能开发中</h3>
              <p className="text-sm text-gray-400 mb-6">
                {devPlatform}登录功能正在紧锣密鼓地开发中，敬请期待！
              </p>
              <button
                onClick={() => setShowDevModal(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all"
              >
                知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
