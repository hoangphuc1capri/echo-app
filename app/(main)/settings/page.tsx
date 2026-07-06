'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Lock, Palette, Globe, ChevronRight, Moon, Sun, HelpCircle, Info, LogOut } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('vi');

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/auth');
      return;
    }
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    localStorage.removeItem('quiz-result');
    router.push('/');
  };

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onClick,
    rightElement
  }: { 
    icon: React.ElementType; 
    title: string; 
    subtitle?: string; 
    onClick?: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 hover:bg-[var(--echo-cream)]/50 rounded-xl transition-colors text-left"
    >
      <div className="w-10 h-10 rounded-xl bg-[var(--echo-cream)] flex items-center justify-center">
        <Icon className="w-5 h-5 text-[var(--echo-wood)]" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-[var(--echo-ink)]">{title}</p>
        {subtitle && <p className="text-xs text-[var(--echo-ink-muted)]">{subtitle}</p>}
      </div>
      {rightElement || <ChevronRight className="w-5 h-5 text-[var(--echo-ink-muted)]" />}
    </button>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 text-sm text-[var(--echo-ink-muted)] mb-2">
          <a href="/dashboard" className="hover:text-[var(--echo-wood)]">Trang chủ</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[var(--echo-ink)]">Cài đặt</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-[var(--echo-ink)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--echo-wood)] to-[var(--echo-wood-dark)] flex items-center justify-center shadow-lg">
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
          Cài đặt
        </h1>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--echo-wood)] to-[var(--echo-wood-dark)] flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[var(--echo-ink)]">
                {user?.name || user?.email.split('@')[0]}
              </h2>
              <p className="text-sm text-[var(--echo-ink-muted)]">{user?.email}</p>
            </div>
            <Button variant="secondary" size="sm">
              Chỉnh sửa
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Settings Groups */}
      <div className="space-y-6">
        {/* Account */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className="text-xs font-medium text-[var(--echo-ink-muted)] uppercase tracking-wider mb-2 px-1">Tài khoản</h3>
          <Card className="p-2">
            <SettingItem
              icon={User}
              title="Thông tin cá nhân"
              subtitle="Cập nhật tên, email"
            />
            <SettingItem
              icon={Lock}
              title="Bảo mật"
              subtitle="Đổi mật khẩu, xác thực"
            />
          </Card>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xs font-medium text-[var(--echo-ink-muted)] uppercase tracking-wider mb-2 px-1">Tùy chọn</h3>
          <Card className="p-2">
            <SettingItem
              icon={Bell}
              title="Thông báo"
              subtitle={notifications ? 'Bật' : 'Tắt'}
              rightElement={
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`
                    relative w-12 h-7 rounded-full transition-colors
                    ${notifications ? 'bg-emerald-500' : 'bg-[var(--echo-parchment)]'}
                  `}
                >
                  <span 
                    className={`
                      absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform
                      ${notifications ? 'left-6' : 'left-1'}
                    `}
                  />
                </button>
              }
            />
            <SettingItem
              icon={Moon}
              title="Chế độ tối"
              subtitle={darkMode ? 'Bật' : 'Tắt'}
              rightElement={
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`
                    relative w-12 h-7 rounded-full transition-colors
                    ${darkMode ? 'bg-emerald-500' : 'bg-[var(--echo-parchment)]'}
                  `}
                >
                  <span 
                    className={`
                      absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform
                      ${darkMode ? 'left-6' : 'left-1'}
                    `}
                  />
                </button>
              }
            />
            <SettingItem
              icon={Globe}
              title="Ngôn ngữ"
              subtitle={language === 'vi' ? 'Tiếng Việt' : 'English'}
            />
            <SettingItem
              icon={Palette}
              title="Giao diện"
              subtitle="Màu sắc, font chữ"
            />
          </Card>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className="text-xs font-medium text-[var(--echo-ink-muted)] uppercase tracking-wider mb-2 px-1">Hỗ trợ</h3>
          <Card className="p-2">
            <SettingItem
              icon={HelpCircle}
              title="Trung tâm trợ giúp"
              subtitle="Câu hỏi thường gặp"
            />
            <SettingItem
              icon={Info}
              title="Giới thiệu ECHO"
              subtitle="Phiên bản 1.0.0"
            />
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xs font-medium text-red-500 uppercase tracking-wider mb-2 px-1">Nguy hiểm</h3>
          <Card className="p-2 border border-red-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-4 hover:bg-red-50 rounded-xl transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-red-600">Đăng xuất</p>
                <p className="text-xs text-red-400">Đăng xuất khỏi tài khoản</p>
              </div>
            </button>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-[var(--echo-ink-muted)]">
          ECHO v1.0.0 • Khám phá bản thân với AI
        </p>
      </motion.div>
    </div>
  );
}
