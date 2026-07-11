'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Menu, X, BarChart3, Users, FileText, ShieldCheck } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Tổng quan', icon: BarChart3 },
  { href: '/admin/users', label: 'Người dùng', icon: Users },
  { href: '/admin/quiz-results', label: 'Kết quả Quiz', icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('auth-token');
    if (!token || !userData) {
      router.push('/auth');
      return;
    }
    const parsed = JSON.parse(userData);
    if (parsed.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    setIsReady(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    document.cookie = 'auth-token=; path=/; max-age=0';
    router.push('/auth');
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--echo-ink)' }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--echo-wood)/30', borderTopColor: 'var(--echo-wood)' }} />
          <p style={{ color: 'var(--echo-parchment)' }}>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--echo-parchment-light)' }}>
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-16 flex items-center justify-between px-4 z-40 shadow-md" style={{ backgroundColor: 'var(--echo-ink)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--echo-wood)' }}>
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-lg text-white">ECHO</span>
            <span className="font-display font-bold text-lg" style={{ color: 'var(--echo-amber)' }}>Admin</span>
          </div>
        </div>
        <button onClick={() => setOpen(true)} className="p-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col z-30">
        <Sidebar pathname={pathname} onLogout={handleLogout} />
      </aside>

      {/* Sidebar (mobile) */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 flex flex-col shadow-2xl" style={{ backgroundColor: 'var(--echo-ink)' }}>
            <div className="h-18 flex items-center justify-between px-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--echo-wood)' }}>
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-display font-bold text-lg text-white">ECHO</span>
                  <span className="font-display font-bold text-lg" style={{ color: 'var(--echo-amber)' }}>Admin</span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar
              pathname={pathname}
              onLogout={handleLogout}
              onNavigate={() => setOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

function Sidebar({
  pathname,
  onLogout,
  onNavigate,
}: {
  pathname: string;
  onLogout: () => void;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="h-18 flex items-center gap-3 px-6 border-b" style={{ backgroundColor: 'var(--echo-ink)', borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--echo-wood)' }}>
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-display font-bold text-lg text-white">ECHO</span>
          <span className="font-display font-bold text-lg" style={{ color: 'var(--echo-amber)' }}>Admin</span>
        </div>
      </div>

      <nav className="flex-1 p-4" style={{ backgroundColor: 'var(--echo-ink)' }}>
        <div className="mb-6">
          <p className="px-4 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm mb-2 transition-all ${
                  active
                    ? 'shadow-lg'
                    : ''
                }`}
                style={active ? 
                  { backgroundColor: 'var(--echo-wood)', color: 'white', fontWeight: 600 } : 
                  { color: 'rgba(255,255,255,0.7)' }
                }
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t" style={{ backgroundColor: 'var(--echo-ink)', borderColor: 'rgba(255,255,255,0.1)' }}>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm transition-colors"
          style={{ color: '#F87171' }}
        >
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </div>
    </>
  );
}
