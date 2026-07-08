'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Menu, X, BarChart3, Users, FileText } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Tổng quan', icon: BarChart3 },
  { href: '/admin/users', label: 'Người dùng', icon: Users },
  { href: '/admin/quiz-results', label: 'Kết quả Quiz', icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    document.cookie = 'auth-token=; path=/; max-age=0';
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-14 bg-white border-b border-[#E5DCC8] flex items-center justify-between px-4 z-40">
        <span className="font-bold text-[#2C1810]">ECHO Admin</span>
        <button onClick={() => setOpen(true)} className="p-1.5">
          <Menu className="w-5 h-5 text-[#5C4033]" />
        </button>
      </header>

      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-56 bg-white border-r border-[#E5DCC8] flex-col z-30">
        <Sidebar pathname={pathname} onLogout={handleLogout} />
      </aside>

      {/* Sidebar (mobile) */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-white flex flex-col">
            <div className="h-14 flex items-center justify-between px-4 border-b border-[#E5DCC8]">
              <span className="font-bold text-[#2C1810]">ECHO Admin</span>
              <button onClick={() => setOpen(false)} className="p-1.5">
                <X className="w-5 h-5 text-[#5C4033]" />
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
      <main className="lg:ml-56 pt-14 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">{children}</div>
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
      <div className="h-14 flex items-center px-5 border-b border-[#E5DCC8]">
        <span className="font-display font-bold text-[#2C1810]">ECHO Admin</span>
      </div>

      <nav className="flex-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-colors ${
                active
                  ? 'bg-[#5C4033]/10 text-[#5C4033] font-medium'
                  : 'text-[#6B5B4F] hover:bg-[#F5EDE0]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#E5DCC8]">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </div>
    </>
  );
}
