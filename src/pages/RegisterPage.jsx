import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, AlertTriangle, ArrowRight, Sparkles, Check } from 'lucide-react';
import { useGame } from '../context/GameContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useGame();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);
  const [devPlatform, setDevPlatform] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = '请输入用户名';
    else if (form.name.length < 2 || form.name.length > 20) newErrors.name = '用户名长度为2-20个字符';
    if (!form.email.trim()) newErrors.email = '请输入邮箱';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = '请输入有效的邮箱地址';
    if (!form.password) newErrors.password = '请输入密码';
    else if (form.password.length < 6) newErrors.password = '密码长度至少6位';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = '两次输入的密码不一致';
    if (!agreed) newErrors.agreed = '请同意用户协议';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      register(form.name, form.email, form.password);
      setIsSubmitting(false);
      navigate('/');
    }, 600);
  };

  const handleSocialRegister = (platform) => {
    setDevPlatform(platform);
    setShowDevModal(true);
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, text: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const levels = [
      { text: '太弱', color: 'bg-red-500' },
      { text: '较弱', color: 'bg-orange-500' },
      { text: '一般', color: 'bg-yellow-500' },
      { text: '良好', color: 'bg-blue-500' },
      { text: '强', color: 'bg-green-500' },
    ];
    return { level: score, text: levels[score]?.text || '', color: levels[score]?.color || '' };
  };

  const strength = getPasswordStrength(form.password);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-[480px]">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#16162a] to-[#0f0f1e] border border-white/[0.06] shadow-2xl shadow-black/50">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[200px] bg-fuchsia-600/8 rounded-full blur-[80px] pointer-events-none" />

          <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-500" />

          <div className="relative px-6 pt-8 pb-8 md:px-10">
            {/* Logo + 标题 */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-amber-500 shadow-xl shadow-violet-500/25 mb-4 float-animation">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gradient font-display mb-2 tracking-wide">
                创建账号
              </h1>
              <p className="text-sm text-gray-500">
                开启你的单词冒险之旅
              </p>
            </div>

            {/* 表单 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 用户名 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <span className="iconfont icon-zhanghao text-violet-400 text-base" />
                  用户名 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="请输入用户名（2-20个字符）"
                  className={`w-full px-5 py-3 rounded-xl bg-white/[0.03] border text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-all duration-300 ${
                    errors.name ? 'border-red-500/40' : 'border-white/8'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              {/* 邮箱 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <span className="iconfont icon-dianhua text-blue-400 text-base" />
                  邮箱 <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  className={`w-full px-5 py-3 rounded-xl bg-white/[0.03] border text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-all duration-300 ${
                    errors.email ? 'border-red-500/40' : 'border-white/8'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* 密码 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <span className="iconfont icon-mima text-amber-400 text-base" />
                  密码 <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="请输入密码（至少6位）"
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
                {/* 密码强度 */}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                          style={{ width: `${(strength.level / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-gray-500">{strength.text}</span>
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-3 h-3" /> {errors.password}
                  </p>
                )}
              </div>

              {/* 确认密码 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <span className="iconfont icon-mima text-emerald-400 text-base" />
                  确认密码 <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="请再次输入密码"
                  className={`w-full px-5 py-3 rounded-xl bg-white/[0.03] border text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-all duration-300 ${
                    errors.confirmPassword ? 'border-red-500/40' : 'border-white/8'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-3 h-3" /> {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* 用户协议 */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <div className="relative flex items-center mt-0.5">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="peer w-4 h-4 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500/30"
                    />
                    {agreed && <Check className="absolute inset-0 w-4 h-4 text-violet-400 pointer-events-none" />}
                  </div>
                  <span className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors leading-relaxed">
                    我已阅读并同意
                    <Link to="/" className="text-violet-400 hover:text-violet-300 mx-1">用户协议</Link>
                    和
                    <Link to="/" className="text-violet-400 hover:text-violet-300 mx-1">隐私政策</Link>
                  </span>
                </label>
                {errors.agreed && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-3 h-3" /> {errors.agreed}
                  </p>
                )}
              </div>

              {/* 注册按钮 */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 text-white font-bold text-sm hover:shadow-xl hover:shadow-violet-500/25 btn-hover transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  '注册'
                )}
              </button>
            </form>

            {/* 第三方注册 */}
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-xs text-gray-600 font-medium">或使用以下方式注册</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>
              <div className="flex items-center justify-center gap-10">
                <button
                  onClick={() => handleSocialRegister('微信')}
                  className="group flex items-center justify-center w-14 h-14 rounded-full bg-[#07C160] hover:bg-[#06a854] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#07C160]/30"
                >
                  <span className="iconfont icon-weixin text-2xl text-white" />
                </button>
                <button
                  onClick={() => handleSocialRegister('QQ')}
                  className="group flex items-center justify-center w-14 h-14 rounded-full bg-[#12B7F5] hover:bg-[#0ea3db] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#12B7F5]/30"
                >
                  <span className="iconfont icon-QQ text-2xl text-white" />
                </button>
                <button
                  onClick={() => handleSocialRegister('微博')}
                  className="group flex items-center justify-center w-14 h-14 rounded-full bg-[#E6162D] hover:bg-[#cc1328] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#E6162D]/30"
                >
                  <span className="iconfont icon-xinlangweibo text-2xl text-white" />
                </button>
              </div>
            </div>

            {/* 登录入口 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                已有账号？{' '}
                <Link
                  to="/login"
                  className="text-violet-400 hover:text-violet-300 font-semibold transition-colors inline-flex items-center gap-1 hover:gap-2"
                >
                  立即登录
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

export default RegisterPage;
