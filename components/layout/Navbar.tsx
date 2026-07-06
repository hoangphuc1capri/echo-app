'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Home, BarChart3, MessageCircle, LogOut, User, Menu, X, Brain } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  user?: {
    email: string;
    name?: string;
  } | null;
  onLogout?: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Trang chủ', icon: Home },
    { href: '/quiz', label: 'Khảo sát', icon: BookOpen },
    { href: '/letter', label: 'Thư của tôi', icon: BarChart3 },
    { href: '/anonymous-room', label: 'Phòng gọi', icon: MessageCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[var(--echo-parchment)]/50 shadow-sm lg:hidden">
      <div className="flex items-center justify-between h-16 px-4">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--echo-wood)] to-[var(--echo-wood-dark)] flex items-center justify-center shadow-md">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-display font-bold text-[var(--echo-ink)]">ECHO</span>
        </Link>

        {user && (
          <button
            className="p-2 rounded-lg text-[var(--echo-ink-muted)] hover:bg-[var(--echo-cream)]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden border-t border-[var(--echo-parchment)] py-4 px-4"
          >
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl font-ui transition-colors
                      ${isActive
                        ? 'bg-[var(--echo-wood)] text-white'
                        : 'text-[var(--echo-ink-muted)] hover:bg-[var(--echo-cream)]'}
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--echo-parchment)]">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-10 h-10 rounded-full bg-[var(--echo-wood)] flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-ui text-sm font-medium text-[var(--echo-ink)]">
                    {user?.name || user?.email}
                  </p>
                  <p className="text-xs text-[var(--echo-ink-muted)]">Đã đăng nhập</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onLogout?.();
                }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[var(--echo-danger)] hover:bg-[var(--echo-danger)]/10 font-ui mt-2"
              >
                <LogOut className="w-5 h-5" />
                Đăng xuất
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
