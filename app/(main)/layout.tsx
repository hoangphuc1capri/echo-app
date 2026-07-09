'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, BookOpen, Mail, MessageCircle,
  LogOut, User, Menu, X,
  BarChart3
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Trang chủ', icon: Home },
  { href: '/quiz', label: 'Khảo sát', icon: BookOpen },
  { href: '/letter', label: 'Thư của tôi', icon: Mail },
  { href: '/anonymous-room', label: 'Phòng gọi', icon: MessageCircle },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const isAdmin = localStorage.getItem('user') ? JSON.parse(userData!).role === 'admin' : false;
    if (isAdmin) {
      router.push('/admin');
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

  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-[#EDE4D3]">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
          <Image
            src="/logo.svg"
            alt="ECHO Logo"
            width={36}
            height={36}
            className="w-9 h-9"
          />
          <span className="text-xl font-display font-bold text-[#2C1810]">ECHO</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors
                ${isActive
                  ? 'bg-[#C9A227]/10 text-[#5C4033] border-l-2 border-[#C9A227]'
                  : 'text-[#6B5B4F] hover:bg-[#F5EDE0] hover:text-[#2C1810]'}
              `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/leaderboard"
              onClick={onClose}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors mt-4
                ${pathname === '/leaderboard'
                  ? 'bg-[#C9A227]/10 text-[#5C4033] border-l-2 border-[#C9A227]'
                  : 'text-[#6B5B4F] hover:bg-[#F5EDE0] hover:text-[#2C1810]'}
              `}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium text-sm">Bảng xếp hạng</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-[#EDE4D3]">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 rounded-full bg-[#5C4033] flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#2C1810] truncate">
              {user?.name || user?.email?.split('@')[0] || 'User'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-[#8B2635] hover:bg-red-50 transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-[#EDE4D3]">
        <div className="flex items-center justify-between h-full px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="ECHO" width={32} height={32} className="w-8 h-8" />
            <span className="text-lg font-bold text-[#2C1810]">ECHO</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2">
            <Menu className="w-6 h-6 text-[#6B5B4F]" />
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-60 flex-col bg-white border-r border-[#EDE4D3]">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
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
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white z-50 flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-5 border-b border-[#EDE4D3]">
                <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setIsSidebarOpen(false)}>
                  <Image src="/logo.svg" alt="ECHO" width={32} height={32} className="w-8 h-8" />
                  <span className="text-lg font-bold text-[#2C1810]">ECHO</span>
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

      {/* Main Content */}
      <main className="lg:ml-60 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
