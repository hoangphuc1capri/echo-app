'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  BarChart2,
  TrendingUp,
  Clock,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import Card from '@/components/ui/Card';

const categoryNames: Record<string, string> = {
  seed_keeper: 'Người giữ lửa',
  walker: 'Người đi trên cầu',
  supported: 'Người thích hỗ trợ',
  hidden_dependent: 'Người phụ thuộc ẩn',
  ai_living: 'Người sống cùng AI',
};

const categoryColors: Record<string, string> = {
  seed_keeper: '#059669',
  walker: '#D97706',
  supported: '#2563EB',
  hidden_dependent: '#DC2626',
  ai_living: '#9333EA',
};

interface Stats {
  totalUsers: number;
  totalQuizzes: number;
  todayUsers: number;
  todayQuizzes: number;
  avgScore: number;
  categoryDistribution: { category: string; count: number }[];
  recentQuizzes: Array<{
    _id: string;
    score: number;
    percentage: number;
    category: string;
    createdAt: string;
    userId: { name?: string; email: string } | null;
  }>;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || 'Không thể tải dữ liệu');
      }
    } catch {
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalCategoryCount = stats?.categoryDistribution.reduce((s, c) => s + c.count, 0) || 1;

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-display font-bold text-[#2C1810]">
            Tổng quan
          </h1>
          <p className="text-sm text-[#6B5B4F] mt-0.5">
            Thống kê hệ thống ECHO
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-[#6B5B4F] hover:bg-[#F5EDE0] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: 'Tổng người dùng',
            value: stats?.totalUsers ?? '...',
            sub: `+${stats?.todayUsers ?? 0} hôm nay`,
            color: '#2563EB',
            bg: 'bg-blue-50',
            href: '/admin/users',
          },
          {
            label: 'Tổng lượt Quiz',
            value: stats?.totalQuizzes ?? '...',
            sub: `+${stats?.todayQuizzes ?? 0} hôm nay`,
            color: '#059669',
            bg: 'bg-emerald-50',
            href: '/admin/quiz-results',
          },
          {
            label: 'Điểm TB',
            value: stats?.avgScore ?? '...',
            sub: 'trung bình',
            color: '#D97706',
            bg: 'bg-amber-50',
            href: '/admin/quiz-results',
          },
          {
            label: 'Tổng kết quả',
            value: stats?.totalQuizzes ?? '...',
            sub: 'tất cả quiz',
            color: '#9333EA',
            bg: 'bg-purple-50',
            href: '/admin/quiz-results',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={stat.href}>
              <Card
                hoverable
                className={`${stat.bg} border-0`}
              >
                <p className="text-xs font-medium mb-1" style={{ color: stat.color }}>
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-[#2C1810]">
                  {stat.value}
                </p>
                <p className="text-xs text-[#6B5B4F] mt-0.5">{stat.sub}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card padding="md">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="w-4 h-4 text-[#5C4033]" />
              <h2 className="font-display font-semibold text-[#2C1810]">
                Phân bổ theo nhóm
              </h2>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((k) => (
                  <div key={k} className="animate-pulse">
                    <div className="h-3 bg-[#EDE4D3] rounded-full w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.categoryDistribution.length === 0 ? (
                  <p className="text-sm text-[#6B5B4F] text-center py-4">
                    Chưa có dữ liệu
                  </p>
                ) : (
                  stats?.categoryDistribution.map((item) => {
                    const pct = Math.round((item.count / totalCategoryCount) * 100);
                    return (
                      <div key={item.category}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#2C1810] font-medium">
                            {categoryNames[item.category] || item.category}
                          </span>
                          <span className="text-[#6B5B4F]">
                            {item.count} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 bg-[#EDE4D3] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor:
                                categoryColors[item.category] || '#6B5B4F',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Recent Quizzes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#5C4033]" />
                <h2 className="font-display font-semibold text-[#2C1810]">
                  Kết quả gần đây
                </h2>
              </div>
              <Link
                href="/admin/quiz-results"
                className="flex items-center gap-1 text-xs text-[#5C4033] hover:underline"
              >
                Xem tất cả
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((k) => (
                  <div key={k} className="animate-pulse flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#EDE4D3]" />
                    <div className="flex-1 h-4 bg-[#EDE4D3] rounded" />
                  </div>
                ))}
              </div>
            ) : stats?.recentQuizzes.length === 0 ? (
              <p className="text-sm text-[#6B5B4F] text-center py-4">
                Chưa có kết quả nào
              </p>
            ) : (
              <div className="space-y-2">
                {stats?.recentQuizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="flex items-center justify-between py-2 border-b border-[#EDE4D3] last:border-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{
                          backgroundColor:
                            categoryColors[quiz.category] || '#6B5B4F',
                        }}
                      >
                        {quiz.score}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#2C1810] truncate">
                          {quiz.userId?.name ||
                            quiz.userId?.email?.split('@')[0] ||
                            'Người dùng'}
                        </p>
                        <p className="text-xs text-[#6B5B4F]">
                          {categoryNames[quiz.category] || quiz.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-xs font-semibold" style={{ color: categoryColors[quiz.category] }}>
                        {quiz.percentage}%
                      </p>
                      <p className="text-xs text-[#6B5B4F]">
                        {formatDate(quiz.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
