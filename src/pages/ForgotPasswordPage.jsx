import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, Sparkles, AlertTriangle, Check, ArrowLeft, RefreshCw } from 'lucide-react';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const validateEmail = () => {
    if (!email.trim()) return { email: '请输入邮箱地址' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { email: '请输入有效的邮箱地址' };
    return {};
  };

  const validateCode = () => {
    if (!code.trim()) return { code: '请输入验证码' };
    if (code.length !== 6) return { code: '验证码为6位数字' };
    return {};
  };

  const validatePassword = () => {
    const errs = {};
    if (!newPassword) errs.newPassword = '请输入新密码';
    else if (newPassword.length < 6) errs.newPassword = '密码长度至少6位';
    if (newPassword !== confirmPassword) errs.confirmPassword = '两次输入的密码不一致';
    return errs;
  };

  const handleSendCode = () => {
    const errs = validateEmail();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyCode = () => {
    const errs = validateCode();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    const errs = validatePassword();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4);
    }, 800);
  };

  const steps = [
    { num: 1, label: '验证邮箱' },
    { num: 2, label: '输入验证码' },
    { num: 3, label: '重置密码' },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-[520px]">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#16162a] to-[#0f0f1e] border border-white/[0.06] shadow-2xl shadow-black/50">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[200px] bg-fuchsia-600/8 rounded-full blur-[80px] pointer-events-none" />

          <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-500" />

          <div className="relative px-8 pt-10 pb-10 md:px-12">
            {/* 返回登录 */}
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              返回登录
            </button>

            {/* Logo + 标题 */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-amber-500 shadow-xl shadow-violet-500/25 mb-5 float-animation">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gradient font-display mb-2 tracking-wide">
                {step === 4 ? '重置成功' : '找回密码'}
              </h1>
              <p className="text-sm text-gray-500">
                {step === 1 && '输入你的邮箱地址，我们将发送验证码'}
                {step === 2 && '请输入邮箱收到的6位验证码'}
                {step === 3 && '设置你的新密码'}
                {step === 4 && '密码已重置，请使用新密码登录'}
              </p>
            </div>

            {/* 步骤指示器 */}
            {step < 4 && (
              <div className="flex items-center justify-center gap-2 mb-8">
                {steps.map((s, i) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step >= s.num
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                        : 'bg-white/5 text-gray-500'
                    }`}>
                      {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                    </div>
                    <span className={`text-xs ${step >= s.num ? 'text-violet-400' : 'text-gray-600'}`}>
                      {s.label}
                    </span>
                    {i < steps.length - 1 && (
                      <div className={`w-8 h-px mx-1 ${step > s.num ? 'bg-violet-500/50' : 'bg-white/5'}`} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Step 1: 输入邮箱 */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2.5">
                    <Mail className="w-4 h-4 text-violet-400" />
                    邮箱地址
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className={`w-full px-5 py-3.5 rounded-xl bg-white/[0.03] border text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-all duration-300 ${
                      errors.email ? 'border-red-500/40' : 'border-white/8'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5 animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleSendCode}
                  disabled={countdown > 0}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 text-white font-bold text-sm hover:shadow-xl hover:shadow-violet-500/25 btn-hover transition-all disabled:opacity-60"
                >
                  {countdown > 0 ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      {countdown}秒后重试
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      发送验证码
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {countdown > 0 && (
                  <p className="text-xs text-gray-500 text-center">
                    验证码已发送至 {email}，请查收
                  </p>
                )}

                {countdown === 0 && email && (
                  <button
                    onClick={() => setStep(2)}
                    className="w-full text-center text-sm text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    已收到验证码？点击继续
                  </button>
                )}
              </div>
            )}

            {/* Step 2: 输入验证码 */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2.5">
                    <span className="iconfont icon-mima text-amber-400 text-base" />
                    验证码
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="请输入6位验证码"
                    maxLength={6}
                    className={`w-full px-5 py-3.5 rounded-xl bg-white/[0.03] border text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-all duration-300 text-center tracking-[0.5em] text-lg ${
                      errors.code ? 'border-red-500/40' : 'border-white/8'
                    }`}
                  />
                  {errors.code && (
                    <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5 animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> {errors.code}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleVerifyCode}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 text-white font-bold text-sm hover:shadow-xl hover:shadow-violet-500/25 btn-hover transition-all"
                >
                  <Check className="w-4 h-4" />
                  验证
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center">
                  <button
                    onClick={() => { setStep(1); setCode(''); }}
                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    邮箱填错了？重新输入
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: 重置密码 */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2.5">
                    <span className="iconfont icon-mima text-violet-400 text-base" />
                    新密码
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="请输入新密码（至少6位）"
                    className={`w-full px-5 py-3.5 rounded-xl bg-white/[0.03] border text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-all duration-300 ${
                      errors.newPassword ? 'border-red-500/40' : 'border-white/8'
                    }`}
                  />
                  {errors.newPassword && (
                    <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5 animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> {errors.newPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2.5">
                    <span className="iconfont icon-mima text-emerald-400 text-base" />
                    确认新密码
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="请再次输入新密码"
                    className={`w-full px-5 py-3.5 rounded-xl bg-white/[0.03] border text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-all duration-300 ${
                      errors.confirmPassword ? 'border-red-500/40' : 'border-white/8'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5 animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 text-white font-bold text-sm hover:shadow-xl hover:shadow-violet-500/25 btn-hover transition-all disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      重置密码
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 4: 成功 */}
            {step === 4 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto shadow-xl shadow-green-500/25">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">密码重置成功</h2>
                  <p className="text-sm text-gray-400">
                    你的密码已成功重置，现在可以使用新密码登录了
                  </p>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 text-white font-bold text-sm hover:shadow-xl hover:shadow-violet-500/25 btn-hover transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                  前往登录
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
