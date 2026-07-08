'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  BarChart2,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Tổng quan', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Người dùng', icon: Users },
  { href: '/admin/quiz-results', label: 'Kết quả Quiz', icon: BarChart2 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('admin-email');
    if (stored) setAdminEmail(stored);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('admin-email');
    localStorage.removeItem('is-admin');
    await fetch('/api/auth/login', { method: 'DELETE' }).catch(() => {});
    router.push('/auth');
  };

  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <>
      <div className="h-14 flex items-center px-5 border-b border-[#EDE4D3]">
        <Link
          href="/admin"
          className="flex items-center gap-2"
          onClick={onClose}
        >
          <div className="w-8 h-8 rounded-lg bg-[#5C4033] flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="text-base font-display font-bold text-[#2C1810]">ECHO Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-3">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm
                    ${isActive
                      ? 'bg-[#5C4033]/10 text-[#5C4033] font-medium'
                      : 'text-[#6B5B4F] hover:bg-[#F5EDE0] hover:text-[#2C1810]'}
                  `}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 border-t border-[#EDE4D3]">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs text-[#6B5B4F]">Đăng nhập với</p>
          <p className="text-sm font-medium text-[#2C1810] truncate">{adminEmail || 'Admin'}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F8F4EE]">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-[#EDE4D3]">
        <div className="flex items-center justify-between h-full px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#5C4033] flex items-center justify-center">
              <span className="text-white font-bold text-xs">E</span>
            </div>
            <span className="text-base font-bold text-[#2C1810]">ECHO</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2"
          >
            <Menu className="w-5 h-5 text-[#6B5B4F]" />
          </button>
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-56 flex-col bg-white border-r border-[#EDE4D3]">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/30 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-60 bg-white z-50 flex flex-col"
            >
              <div className="h-14 flex items-center justify-between px-5 border-b border-[#EDE4D3]">
                <Link href="/admin" className="flex items-center gap-2" onClick={() => setIsSidebarOpen(false)}>
                  <div className="w-8 h-8 rounded-lg bg-[#5C4033] flex items-center justify-center">
                    <span className="text-white font-bold text-sm">E</span>
                  </div>
                  <span className="text-base font-bold text-[#2C1810]">ECHO</span>
                </Link>
                <button onClick={() => setIsSidebarOpen(false)}>
                  <X className="w-5 h-5 text-[#6B5B4F]" />
                </button>
              </div>
              <SidebarContent onClose={() => setIsSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="lg:ml-56 pt-14 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
