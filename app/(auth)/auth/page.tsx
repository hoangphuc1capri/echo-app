'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Mail, Lock, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Container from '@/components/ui/Container';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Đã xảy ra lỗi');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('auth-token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      localStorage.setItem('is-admin', data.data.isAdmin ? '1' : '0');

      if (data.data.isAdmin) {
        // Also set the admin cookie so proxy.ts can read it
        await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
          credentials: 'include',
        });
        router.push('/admin');
      } else {
        router.push('/quiz');
      }
    } catch {
      setError('Đã xảy ra lỗi kết nối');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen paper-texture flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--echo-amber)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--echo-wood)]/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-xl bg-[var(--echo-wood)] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <span className="text-4xl font-display font-bold text-[var(--echo-ink)]">ECHO</span>
          </Link>
        </div>

        <Card variant="elevated" padding="lg" className="bg-white/95 backdrop-blur-sm">
          <div className="flex mb-8 border-b-2 border-[var(--echo-parchment)]">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-4 font-ui font-medium transition-colors relative ${
                isLogin ? 'text-[var(--echo-wood)]' : 'text-[var(--echo-ink-muted)]'
              }`}
            >
              Đăng nhập
              {isLogin && (
                <motion.div
                  layoutId="auth-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--echo-wood)]"
                />
              )}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-4 font-ui font-medium transition-colors relative ${
                !isLogin ? 'text-[var(--echo-wood)]' : 'text-[var(--echo-ink-muted)]'
              }`}
            >
              Đăng ký
              {!isLogin && (
                <motion.div
                  layoutId="auth-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--echo-wood)]"
                />
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    type="text"
                    label="Tên của bạn"
                    placeholder="Nhập tên của bạn"
                    leftIcon={<User className="w-5 h-5" />}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input
              type="email"
              label="Email"
              placeholder="Nhập email của bạn"
              leftIcon={<Mail className="w-5 h-5" />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              type="password"
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              leftIcon={<Lock className="w-5 h-5" />}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[var(--echo-danger)] text-sm font-ui text-center shake"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              className="shadow-lg hover:shadow-xl mt-2"
            >
              {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[var(--echo-ink-muted)] text-sm font-ui">
              {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[var(--echo-wood)] font-semibold hover:underline"
              >
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-[var(--echo-ink-muted)] text-sm font-ui hover:text-[var(--echo-wood)] transition-colors"
          >
            Quay về trang chủ
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
