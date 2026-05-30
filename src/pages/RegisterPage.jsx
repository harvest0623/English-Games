import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, AlertTriangle, ArrowRight, Sparkles, BookOpen, Swords, Trophy, Brain, Target, Flame, Check, X } from 'lucide-react';
import { useGame } from '../context/GameContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useGame();
  const [form, setForm] = useState({ name: '', phone: '', password: '', confirmPassword: '' });
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
    if (!form.phone.trim()) newErrors.phone = '请输入手机号';
    else if (!/^1[3-9]\d{9}$/.test(form.phone)) newErrors.phone = '请输入有效的11位手机号';
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
      register(form.name, form.phone, form.password);
      setIsSubmitting(false);
      navigate('/');
    }, 600);
  };

  const handleSocialRegister = (platform) => {
    setDevPlatform(platform);
    setShowDevModal(true);
  };

  // 密码强度分析
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, text: '', color: '', textColor: '', suggestions: [] };

    const checks = {
      length8: pwd.length >= 8,
      length6: pwd.length >= 6,
      hasLower: /[a-z]/.test(pwd),
      hasUpper: /[A-Z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[^A-Za-z0-9]/.test(pwd),
    };

    let score = 0;
    if (checks.length6) score++;
    if (checks.length8) score++;
    if (checks.hasUpper) score++;
    if (checks.hasNumber) score++;
    if (checks.hasSpecial) score++;

    const levels = [
      { text: '太弱', color: 'bg-red-500', textColor: 'text-red-400', width: '10%' },
      { text: '较弱', color: 'bg-red-400', textColor: 'text-red-400', width: '25%' },
      { text: '一般', color: 'bg-yellow-500', textColor: 'text-yellow-400', width: '50%' },
      { text: '良好', color: 'bg-blue-500', textColor: 'text-blue-400', width: '75%' },
      { text: '强', color: 'bg-green-500', textColor: 'text-green-400', width: '100%' },
    ];

    const levelInfo = levels[Math.min(score, 4)];

    // 生成改进建议
    const suggestions = [];
    if (!checks.length8) suggestions.push('密码长度至少8位');
    if (!checks.hasUpper) suggestions.push('添加大写字母');
    if (!checks.hasNumber) suggestions.push('添加数字');
    if (!checks.hasSpecial) suggestions.push('添加特殊字符');

    return {
      level: score,
      text: levelInfo.text,
      color: levelInfo.color,
      textColor: levelInfo.textColor,
      width: levelInfo.width,
      suggestions,
      checks,
    };
  };

  const strength = getPasswordStrength(form.password);

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case '微信':
        return { icon: 'icon-weixin', bgLight: 'bg-[#07C160]/10', textColor: 'text-[#07C160]' };
      case 'QQ':
        return { icon: 'icon-QQ', bgLight: 'bg-[#12B7F5]/10', textColor: 'text-[#12B7F5]' };
      case '微博':
        return { icon: 'icon-xinlangweibo', bgLight: 'bg-[#E6162D]/10', textColor: 'text-[#E6162D]' };
      default:
        return { icon: 'icon-gongjuxiang', bgLight: 'bg-amber-500/10', textColor: 'text-amber-400' };
    }
  };

  const platformInfo = getPlatformIcon(devPlatform);

  const features = [
    { icon: BookOpen, text: '海量词库', desc: '覆盖四六级/雅思/托福' },
    { icon: Swords, text: '战斗闯关', desc: '单词对战趣味学习' },
    { icon: Trophy, text: '成就系统', desc: '解锁徽章挑战排行' },
    { icon: Brain, text: '智能记忆', desc: '艾宾浩斯遗忘曲线' },
  ];

  const tags = ['游戏化学习', '智能复习', '成就系统', '实时排行', '多词库支持'];

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* 左侧品牌区域 */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-shrink-0 relative overflow-hidden">
        {/* 背景渐变 */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-fuchsia-900/30 to-amber-900/20" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-fuchsia-600/15 rounded-full blur-[80px]" />
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px]" />
        </div>

        {/* 装饰元素 */}
        <div className="absolute top-8 left-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">单词冒险</h2>
              <p className="text-[10px] text-gray-400 -mt-0.5">Word Quest RPG</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
          {/* 主标题 */}
          <div className="mb-8">
            <h1 className="text-4xl xl:text-5xl font-black text-white font-display leading-tight mb-4">
              开启你的
              <br />
              <span className="text-gradient">单词冒险</span>
            </h1>
            <p className="text-base text-gray-400 leading-relaxed max-w-sm">
              加入数万学习者，在游戏中轻松掌握海量词汇，让背单词变得有趣
            </p>
          </div>

          {/* 特性列表 */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4.5 h-4.5 text-violet-300" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{item.text}</div>
                    <div className="text-[11px] text-gray-500">{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.05] text-gray-400 border border-white/[0.08]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 统计数据 */}
          <div className="flex items-center gap-8 mt-10 pt-8 border-t border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-violet-400" />
              <div>
                <div className="text-lg font-bold text-white">10万+</div>
                <div className="text-[11px] text-gray-500">词汇量</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-lg font-bold text-white">50+</div>
                <div className="text-[11px] text-gray-500">关卡挑战</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-fuchsia-400" />
              <div>
                <div className="text-lg font-bold text-white">100+</div>
                <div className="text-[11px] text-gray-500">成就徽章</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧注册表单区域 */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-[420px] my-auto">
          {/* 移动端Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">单词冒险</h2>
              <p className="text-[10px] text-gray-400 -mt-0.5">Word Quest RPG</p>
            </div>
          </div>

          {/* 注册卡片 */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#16162a] to-[#0f0f1e] border border-white/[0.06] shadow-2xl shadow-black/50">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative px-6 py-8 sm:px-8">
              {/* 标题 */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white font-display mb-2 tracking-wide">
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
                      errors.name ? 'border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.3)]' : 'border-white/8'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5 animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> {errors.name}
                    </p>
                  )}
                </div>

                {/* 手机号 */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <span className="iconfont icon-dianhua text-blue-400 text-base" />
                    手机号 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="请输入11位手机号"
                    maxLength={11}
                    className={`w-full px-5 py-3 rounded-xl bg-white/[0.03] border text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-all duration-300 ${
                      errors.phone ? 'border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.3)]' : 'border-white/8'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5 animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> {errors.phone}
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
                      placeholder="至少8位，包含字母和数字/特殊字符"
                      className={`w-full px-5 py-3 pr-12 rounded-xl bg-white/[0.03] border text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-all duration-300 ${
                        errors.password ? 'border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.3)]' : 'border-white/8'
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

                  {/* 密码强度显示 */}
                  {form.password && (
                    <div className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      {/* 强度条 */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
                            style={{ width: strength.width }}
                          />
                        </div>
                        <span className={`text-xs font-semibold ${strength.textColor}`}>
                          密码强度：{strength.text}
                        </span>
                      </div>

                      {/* 检查项列表 */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          {strength.checks?.length8 ? (
                            <Check className="w-3.5 h-3.5 text-green-400" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-gray-600" />
                          )}
                          <span className={`text-xs ${strength.checks?.length8 ? 'text-green-400' : 'text-gray-500'}`}>
                            密码长度至少8位
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {strength.checks?.hasUpper ? (
                            <Check className="w-3.5 h-3.5 text-green-400" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-gray-600" />
                          )}
                          <span className={`text-xs ${strength.checks?.hasUpper ? 'text-green-400' : 'text-gray-500'}`}>
                            包含大写字母
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {strength.checks?.hasNumber ? (
                            <Check className="w-3.5 h-3.5 text-green-400" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-gray-600" />
                          )}
                          <span className={`text-xs ${strength.checks?.hasNumber ? 'text-green-400' : 'text-gray-500'}`}>
                            包含数字
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {strength.checks?.hasSpecial ? (
                            <Check className="w-3.5 h-3.5 text-green-400" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-gray-600" />
                          )}
                          <span className={`text-xs ${strength.checks?.hasSpecial ? 'text-green-400' : 'text-gray-500'}`}>
                            包含特殊字符
                          </span>
                        </div>
                      </div>

                      {/* 改进建议 */}
                      {strength.suggestions.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-white/[0.05]">
                          <p className="text-[11px] text-gray-500 mb-1">改进建议：</p>
                          {strength.suggestions.map((suggestion, idx) => (
                            <p key={idx} className="text-[11px] text-red-400/80">· {suggestion}</p>
                          ))}
                        </div>
                      )}
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
                      errors.confirmPassword ? 'border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.3)]' : 'border-white/8'
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
                    className="group flex items-center justify-center w-12 h-12 rounded-full bg-[#07C160] hover:bg-[#06a854] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#07C160]/30"
                  >
                    <span className="iconfont icon-weixin text-[28px] text-white" />
                  </button>
                  <button
                    onClick={() => handleSocialRegister('QQ')}
                    className="group flex items-center justify-center w-12 h-12 rounded-full bg-[#12B7F5] hover:bg-[#0ea3db] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#12B7F5]/30"
                  >
                    <span className="iconfont icon-QQ text-[28px] text-white" />
                  </button>
                  <button
                    onClick={() => handleSocialRegister('微博')}
                    className="group flex items-center justify-center w-12 h-12 rounded-full bg-[#E6162D] hover:bg-[#cc1328] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#E6162D]/30"
                  >
                    <span className="iconfont icon-xinlangweibo text-[28px] text-white" />
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
      </div>

      {/* 开发中提示弹框 */}
      {showDevModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDevModal(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#1e1e3a] to-[#141428] border border-white/[0.08] shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${platformInfo.bgLight} mb-4`}>
                <span className={`iconfont ${platformInfo.icon} text-3xl ${platformInfo.textColor}`} />
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
