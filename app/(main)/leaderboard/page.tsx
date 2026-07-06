'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, ChevronRight, TrendingUp, Medal, Users, Crown, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface LeaderboardEntry {
  id: number;
  name: string;
  avatar: string;
  score: number;
  category: string;
  trend: 'up' | 'down' | 'same';
  tests: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { id: 1, name: 'Minh Đức', avatar: '👑', score: 8, category: 'seed_keeper', trend: 'up', tests: 12 },
  { id: 2, name: 'Thu Hà', avatar: '🌟', score: 12, category: 'walker', trend: 'down', tests: 8 },
  { id: 3, name: 'Anh Tuấn', avatar: '🎯', score: 18, category: 'walker', trend: 'same', tests: 15 },
  { id: 4, name: 'Lan Chi', avatar: '🌸', score: 22, category: 'supported', trend: 'up', tests: 6 },
  { id: 5, name: 'Hoàng Nam', avatar: '🌿', score: 25, category: 'supported', trend: 'same', tests: 10 },
  { id: 6, name: 'Phương Linh', avatar: '🌻', score: 28, category: 'borrowed_mind', trend: 'down', tests: 20 },
  { id: 7, name: 'Minh Khoa', avatar: '🚀', score: 32, category: 'borrowed_mind', trend: 'up', tests: 18 },
  { id: 8, name: 'Hồng Anh', avatar: '🦋', score: 35, category: 'borrowed_mind', trend: 'same', tests: 22 },
  { id: 9, name: 'Văn Đức', avatar: '⚡', score: 38, category: 'borrowed_mind', trend: 'up', tests: 25 },
  { id: 10, name: 'Thanh Hà', avatar: '💫', score: 42, category: 'echo_prisoner', trend: 'down', tests: 30 },
];

export default function LeaderboardPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      router.push('/auth');
    }
  }, [router]);

  const categoryColors: Record<string, string> = {
    'seed_keeper': '#059669',
    'walker': '#D97706',
    'supported': '#2563EB',
    'borrowed_mind': '#DC2626',
    'echo_prisoner': '#9333EA',
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'same') => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-emerald-500" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

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
          <span className="text-[var(--echo-ink)]">Bảng xếp hạng</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-[var(--echo-ink)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          Bảng xếp hạng
        </h1>
        <p className="text-[var(--echo-ink-muted)] mt-1">
          Những người có mức độ phụ thuộc AI thấp nhất
        </p>
      </motion.div>

      {/* Top 3 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {/* 2nd Place */}
          {mockLeaderboard[1] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 mx-auto flex items-center justify-center text-4xl shadow-lg border-4 border-gray-400">
                  {mockLeaderboard[1].avatar}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm">
                  🥈
                </div>
              </div>
              <p className="font-semibold text-[var(--echo-ink)] mt-3">{mockLeaderboard[1].name}</p>
              <p className="text-2xl font-bold text-gray-500">{mockLeaderboard[1].score}%</p>
            </motion.div>
          )}

          {/* 1st Place */}
          {mockLeaderboard[0] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 mx-auto flex items-center justify-center text-5xl shadow-xl border-4 border-amber-400">
                  {mockLeaderboard[0].avatar}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                  🥇
                </div>
              </div>
              <p className="font-bold text-[var(--echo-ink)] mt-3 text-lg">{mockLeaderboard[0].name}</p>
              <p className="text-3xl font-bold text-amber-600">{mockLeaderboard[0].score}%</p>
            </motion.div>
          )}

          {/* 3rd Place */}
          {mockLeaderboard[2] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 mx-auto flex items-center justify-center text-4xl shadow-lg border-4 border-amber-700">
                  {mockLeaderboard[2].avatar}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold text-sm">
                  🥉
                </div>
              </div>
              <p className="font-semibold text-[var(--echo-ink)] mt-3">{mockLeaderboard[2].name}</p>
              <p className="text-2xl font-bold text-amber-700">{mockLeaderboard[2].score}%</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 mb-6"
      >
        {(['all', 'week', 'month'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-all
              ${filter === tab
                ? 'bg-[var(--echo-wood)] text-white shadow-md'
                : 'bg-[var(--echo-cream)] text-[var(--echo-ink-muted)] hover:bg-[var(--echo-parchment)]'}
            `}
          >
            {tab === 'all' ? 'Tất cả' : tab === 'week' ? 'Tuần này' : 'Tháng này'}
          </button>
        ))}
      </motion.div>

      {/* Full List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="overflow-hidden p-0">
          <div className="divide-y divide-[var(--echo-parchment)]">
            {mockLeaderboard.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`
                  flex items-center gap-4 p-4 hover:bg-[var(--echo-cream)]/50 transition-colors
                  ${index < 3 ? 'bg-gradient-to-r from-amber-50/50 to-transparent' : ''}
                `}
              >
                {/* Rank */}
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg
                  ${index === 0 ? 'bg-amber-500 text-white' : index === 1 ? 'bg-gray-400 text-white' : index === 2 ? 'bg-amber-700 text-white' : 'bg-[var(--echo-parchment)] text-[var(--echo-ink-muted)]'}
                `}>
                  {index < 3 ? '' : entry.id}
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl bg-[var(--echo-cream)] flex items-center justify-center text-2xl">
                  {entry.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--echo-ink)]">{entry.name}</p>
                  <p className="text-xs text-[var(--echo-ink-muted)]">{entry.tests} lần test</p>
                </div>

                {/* Category */}
                <Badge 
                  variant={entry.category === 'seed_keeper' ? 'seed' : 
                         entry.category === 'walker' ? 'walker' :
                         entry.category === 'supported' ? 'supported' :
                         entry.category === 'borrowed_mind' ? 'borrowed' : 'prisoner'}
                />

                {/* Score */}
                <div className="text-right min-w-[80px]">
                  <p className="text-xl font-bold" style={{ color: categoryColors[entry.category] }}>
                    {entry.score}%
                  </p>
                </div>

                {/* Trend */}
                <div className="w-8 flex justify-center">
                  {getTrendIcon(entry.trend)}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <Card className="bg-gradient-to-r from-[var(--echo-wood)]/10 to-transparent border border-[var(--echo-wood)]/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--echo-wood)] flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[var(--echo-ink)]">Vị trí của bạn: #4</h3>
              <p className="text-sm text-[var(--echo-ink-muted)]">Tiếp tục cố gắng để vươn lên top!</p>
            </div>
            <Button variant="secondary" onClick={() => router.push('/quiz')}>
              Làm khảo sát
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
