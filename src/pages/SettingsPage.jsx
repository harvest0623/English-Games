import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings, User, Mail, Phone, Lock, Shield, Bell, Eye,
  Save, Check, X, ChevronRight, AlertTriangle, ToggleLeft,
  ToggleRight, KeyRound, Fingerprint, Globe, Share2
} from 'lucide-react';
import { useGame } from '../context/GameContext';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { player, updateProfile, changePassword, updateUserSettings } = useGame();

  const [activeTab, setActiveTab] = useState('profile');
  const [saveNotification, setSaveNotification] = useState(null);

  // 个人信息表单
  const [profileForm, setProfileForm] = useState({
    name: player.name || '',
    email: player.user?.email || '',
    phone: player.user?.phone || ''
  });
  const [profileErrors, setProfileErrors] = useState({});

  // 密码表单
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // 设置项
  const [settings, setSettings] = useState({
    emailNotifications: player.userSettings?.emailNotifications ?? true,
    pushNotifications: player.userSettings?.pushNotifications ?? true,
    twoFactorAuth: player.userSettings?.twoFactorAuth ?? false,
    profileVisibility: player.userSettings?.profileVisibility || 'public',
    dataSharing: player.userSettings?.dataSharing ?? false
  });

  useEffect(() => {
    setProfileForm({
      name: player.name || '',
      email: player.user?.email || '',
      phone: player.user?.phone || ''
    });
    setSettings({
      emailNotifications: player.userSettings?.emailNotifications ?? true,
      pushNotifications: player.userSettings?.pushNotifications ?? true,
      twoFactorAuth: player.userSettings?.twoFactorAuth ?? false,
      profileVisibility: player.userSettings?.profileVisibility || 'public',
      dataSharing: player.userSettings?.dataSharing ?? false
    });
  }, [player]);

  const showSaveSuccess = (message) => {
    setSaveNotification(message || '设置已保存');
    setTimeout(() => setSaveNotification(null), 2500);
  };

  // 个人信息验证
  const validateProfile = () => {
    const errors = {};
    if (!profileForm.name.trim()) {
      errors.name = '请输入姓名';
    } else if (profileForm.name.length < 2 || profileForm.name.length > 20) {
      errors.name = '姓名长度为2-20个字符';
    }
    if (profileForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      errors.email = '请输入有效的邮箱地址';
    }
    if (profileForm.phone && !/^1[3-9]\d{9}$/.test(profileForm.phone)) {
      errors.phone = '请输入有效的手机号码';
    }
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = () => {
    if (!validateProfile()) return;
    updateProfile(profileForm);
    showSaveSuccess('个人信息已保存');
  };

  // 密码验证
  const validatePassword = () => {
    const errors = {};
    if (!passwordForm.oldPassword) {
      errors.oldPassword = '请输入当前密码';
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = '请输入新密码';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = '密码长度至少6位';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = '两次输入的密码不一致';
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = () => {
    if (!validatePassword()) return;
    changePassword(passwordForm.oldPassword, passwordForm.newPassword);
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    showSaveSuccess('密码修改成功');
  };

  // 设置开关
  const handleToggleSetting = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    updateUserSettings({ [key]: newSettings[key] });
    showSaveSuccess('设置已更新');
  };

  // 可见范围
  const handleVisibilityChange = (value) => {
    setSettings(prev => ({ ...prev, profileVisibility: value }));
    updateUserSettings({ profileVisibility: value });
    showSaveSuccess('可见范围已更新');
  };

  const tabs = [
    { id: 'profile', label: '个人信息', icon: User },
    { id: 'security', label: '账号安全', icon: Shield },
    { id: 'notifications', label: '通知设置', icon: Bell },
    { id: 'privacy', label: '隐私设置', icon: Eye },
  ];

  const ToggleSwitch = ({ enabled, onToggle }) => (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        enabled ? 'bg-violet-500' : 'bg-white/10'
      }`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
          enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gradient font-display mb-6 flex items-center gap-2">
        <Settings className="w-6 h-6 text-violet-400" />
        设置
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧标签页导航 */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="glass-card rounded-2xl p-2 lg:p-3 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-violet-500/20 text-violet-300'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden lg:inline">{tab.label}</span>
                  <span className="lg:hidden">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 右侧内容区域 */}
        <div className="flex-1 min-w-0">
          {/* 个人信息 */}
          {activeTab === 'profile' && (
            <div className="glass-card rounded-2xl p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">个人信息</h2>
                <p className="text-sm text-gray-400">管理你的基本账户信息</p>
              </div>

              {/* 头像区域 */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center bg-gray-600 overflow-hidden">
                  {player.user?.avatar ? (
                    <img src={player.user.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{player.name}</div>
                  <div className="text-xs text-gray-400">Lv.{player.level} · {player.user?.createdAt ? `注册于 ${new Date(player.user.createdAt).toLocaleDateString()}` : '本地账户'}</div>
                </div>
              </div>

              {/* 表单字段 */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <User className="w-4 h-4 text-violet-400" />
                    用户昵称 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="请输入昵称"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors ${
                      profileErrors.name ? 'border-red-500/50' : 'border-white/10'
                    }`}
                  />
                  {profileErrors.name && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {profileErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    邮箱地址
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors ${
                      profileErrors.email ? 'border-red-500/50' : 'border-white/10'
                    }`}
                  />
                  {profileErrors.email && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {profileErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    手机号码
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="13800138000"
                    maxLength={11}
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors ${
                      profileErrors.phone ? 'border-red-500/50' : 'border-white/10'
                    }`}
                  />
                  {profileErrors.phone && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {profileErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-violet-500/30 btn-hover transition-all"
              >
                <Save className="w-4 h-4" />
                保存修改
              </button>
            </div>
          )}

          {/* 账号安全 */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* 修改密码 */}
              <div className="glass-card rounded-2xl p-6 space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">修改密码</h2>
                  <p className="text-sm text-gray-400">定期更换密码可以提高账号安全性</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <Lock className="w-4 h-4 text-amber-400" />
                      当前密码 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordForm.oldPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, oldPassword: e.target.value }))}
                      placeholder="请输入当前密码"
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors ${
                        passwordErrors.oldPassword ? 'border-red-500/50' : 'border-white/10'
                      }`}
                    />
                    {passwordErrors.oldPassword && (
                      <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {passwordErrors.oldPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <KeyRound className="w-4 h-4 text-violet-400" />
                      新密码 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="请输入新密码（至少6位）"
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors ${
                        passwordErrors.newPassword ? 'border-red-500/50' : 'border-white/10'
                      }`}
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {passwordErrors.newPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <KeyRound className="w-4 h-4 text-emerald-400" />
                      确认新密码 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="请再次输入新密码"
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors ${
                        passwordErrors.confirmPassword ? 'border-red-500/50' : 'border-white/10'
                      }`}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {passwordErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleChangePassword}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-violet-500/30 btn-hover transition-all"
                >
                  <Lock className="w-4 h-4" />
                  修改密码
                </button>
              </div>

              {/* 两步验证 */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Fingerprint className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">两步验证</h3>
                      <p className="text-sm text-gray-400">登录时需要额外验证，提升安全性</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={settings.twoFactorAuth}
                    onToggle={() => handleToggleSetting('twoFactorAuth')}
                  />
                </div>
                {settings.twoFactorAuth && (
                  <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-sm text-emerald-300">两步验证已开启，登录时将要求输入验证码</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 通知设置 */}
          {activeTab === 'notifications' && (
            <div className="glass-card rounded-2xl p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">通知设置</h2>
                <p className="text-sm text-gray-400">管理你的通知偏好</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white text-sm">邮件通知</h3>
                      <p className="text-xs text-gray-400">接收学习提醒、活动通知等邮件</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={settings.emailNotifications}
                    onToggle={() => handleToggleSetting('emailNotifications')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white text-sm">消息推送</h3>
                      <p className="text-xs text-gray-400">接收应用内推送通知和系统消息</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={settings.pushNotifications}
                    onToggle={() => handleToggleSetting('pushNotifications')}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 隐私设置 */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              {/* 个人资料可见范围 */}
              <div className="glass-card rounded-2xl p-6 space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">隐私设置</h2>
                  <p className="text-sm text-gray-400">控制你的个人信息可见范围</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                    <Eye className="w-4 h-4 text-violet-400" />
                    个人资料可见范围
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: 'public', label: '公开', desc: '所有人可见', icon: Globe },
                      { value: 'friends', label: '好友', desc: '仅好友可见', icon: User },
                      { value: 'private', label: '私密', desc: '仅自己可见', icon: Lock },
                    ].map((option) => {
                      const Icon = option.icon;
                      const isSelected = settings.profileVisibility === option.value;
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleVisibilityChange(option.value)}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-violet-500/10 border-violet-500/30'
                              : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-violet-400' : 'text-gray-500'}`} />
                            <span className={`text-sm font-medium ${isSelected ? 'text-violet-300' : 'text-gray-300'}`}>
                              {option.label}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-violet-400 ml-auto" />}
                          </div>
                          <p className="text-xs text-gray-500">{option.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 数据共享 */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Share2 className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">数据共享</h3>
                      <p className="text-sm text-gray-400">允许匿名学习数据用于改善产品体验</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={settings.dataSharing}
                    onToggle={() => handleToggleSetting('dataSharing')}
                  />
                </div>
              </div>

              {/* 危险区域 */}
              <div className="glass-card rounded-2xl p-6 border-red-500/20">
                <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  危险区域
                </h3>
                <p className="text-sm text-gray-400 mb-4">以下操作不可撤销，请谨慎操作</p>
                <button
                  onClick={() => navigate('/profile')}
                  className="px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
                >
                  重置游戏数据
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 保存成功提示 */}
      {saveNotification && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-green-500/30 flex items-center gap-3 animate-bounce">
            <Check className="w-5 h-5" />
            <span className="font-medium">{saveNotification}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
