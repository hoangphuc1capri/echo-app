'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, LogIn, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Đăng nhập thất bại');
        return;
      }

      router.push('/admin');
    } catch {
      setError('Đã xảy ra lỗi kết nối');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#5C4033] flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-[#2C1810]">ECHO Admin</h1>
          <p className="text-sm text-[#6B5B4F] mt-1">Trang quản trị hệ thống</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2C1810] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@echo.vn"
                required
                className="w-full h-11 px-4 rounded-xl border-2 border-[#EDE4D3] bg-white text-[#2C1810] focus:border-[#5C4033] focus:outline-none transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C1810] mb-1.5">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-11 px-4 rounded-xl border-2 border-[#EDE4D3] bg-white text-[#2C1810] focus:border-[#5C4033] focus:outline-none transition-colors text-sm"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Đăng nhập
                </>
              )}
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-[#6B5B4F] mt-6">
          Chỉ dành cho quản trị viên
        </p>
      </div>
    </div>
  );
}
