'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  BarChart2,
  TrendingUp,
  Clock,
  RefreshCw,
  ChevronRight,
  Download,
  CheckCircle,
  Star,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import * as XLSX from 'xlsx';

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
  usersWithQuizzes: number;
  completionRate: number;
  avgScore: number;
  avgPercentage: number;
  today: { users: number; quizzes: number };
  week: { users: number; quizzes: number };
  month: { users: number; quizzes: number };
  categoryDistribution: { category: string; count: number }[];
  quizzesByDay: { _id: string; count: number; avgScore: number }[];
  usersByDay: { _id: string; count: number }[];
  topUsers: Array<{
    _id: string;
    quizCount: number;
    lastQuiz: string;
    name: string;
    email: string;
  }>;
}

function StatCard({
  label,
  value,
  sub,
  icon,
  color,
  href,
  delay = 0,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color: string;
  href?: string;
  delay?: number;
}) {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card hoverable={!!href} className="relative overflow-hidden cursor-default">
        <div
          className="absolute top-0 right-0 w-20 h-20 opacity-10 rounded-bl-full"
          style={{ background: `radial-gradient(circle at top right, ${color}, transparent)` }}
        />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium mb-1" style={{ color }}>{label}</p>
            <p className="text-2xl font-bold text-[#2C1810]">{value}</p>
            {sub && <p className="text-xs text-[#6B5B4F] mt-0.5">{sub}</p>}
          </div>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}15` }}
          >
            <span style={{ color }}>{icon}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }
  return inner;
}

function PeriodBadge({
  label,
  users,
  quizzes,
}: {
  label: string;
  users: number;
  quizzes: number;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-white rounded-xl border border-[#EDE4D3]">
      <span className="text-xs font-medium text-[#6B5B4F] w-14">{label}</span>
      <div className="flex items-center gap-1 text-xs text-[#2C1810]">
        <Users className="w-3 h-3 text-blue-500" />
        <span className="font-medium">{users}</span>
      </div>
      <div className="flex items-center gap-1 text-xs text-[#2C1810]">
        <BarChart2 className="w-3 h-3 text-emerald-500" />
        <span className="font-medium">{quizzes}</span>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  const fetchStats = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const exportSummary = () => {
    if (!stats) return;
    setExporting(true);
    const wb = XLSX.utils.book_new();

    // Sheet 1: Tổng quan
    const overview = [
      ['BÁO CÁO TỔNG QUAN HỆ THỐNG ECHO'],
      ['Ngày xuất:', new Date().toLocaleString('vi-VN')],
      [''],
      ['Chỉ số', 'Giá trị'],
      ['Tổng người dùng', stats.totalUsers],
      ['Người dùng đã làm quiz', stats.usersWithQuizzes],
      ['Tỷ lệ hoàn thành quiz', `${stats.completionRate}%`],
      ['Tổng lượt quiz', stats.totalQuizzes],
      ['�iểm trung bình', stats.avgScore],
      ['Phần trăm phụ thuộc TB', `${stats.avgPercentage}%`],
      [''],
      ['THEO THỜI GIAN', 'Người dùng mới', 'Lượt quiz'],
      ['Hôm nay', stats.today.users, stats.today.quizzes],
      ['Tuần này', stats.week.users, stats.week.quizzes],
      ['Tháng này', stats.month.users, stats.month.quizzes],
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Tổng quan');

    // Sheet 2: Phân bổ nhóm
    const catData = [
      ['Nhóm', 'Số người', 'Tỷ lệ %'],
      ...stats.categoryDistribution.map((c) => [
        categoryNames[c.category] || c.category,
        c.count,
        `${stats.totalQuizzes > 0 ? Math.round((c.count / stats.totalQuizzes) * 100) : 0}%`,
      ]),
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(catData);
    ws2['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Phân bổ nhóm');

    // Sheet 3: Top users
    if (stats.topUsers.length > 0) {
      const topData = [
        ['Top người dùng tích cực'],
        ['STT', 'Tên', 'Email', 'Số quiz', 'Quiz gần nhất'],
        ...stats.topUsers.map((u, i) => [
          i + 1,
          u.name,
          u.email,
          u.quizCount,
          new Date(u.lastQuiz).toLocaleString('vi-VN'),
        ]),
      ];
      const ws3 = XLSX.utils.aoa_to_sheet(topData);
      ws3['!cols'] = [{ wch: 5 }, { wch: 25 }, { wch: 30 }, { wch: 10 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(wb, ws3, 'Top người dùng');
    }

    // Sheet 4: Quiz theo ngày
    if (stats.quizzesByDay.length > 0) {
      const dayData = [
        ['Ngày', 'Số quiz', 'Điểm TB'],
        ...stats.quizzesByDay.map((d) => [d._id, d.count, d.avgScore.toFixed(1)]),
      ];
      const ws4 = XLSX.utils.aoa_to_sheet(dayData);
      ws4['!cols'] = [{ wch: 15 }, { wch: 10 }, { wch: 10 }];
      XLSX.utils.book_append_sheet(wb, ws4, 'Quiz 30 ngày');
    }

    XLSX.writeFile(wb, `echo-admin-report-${new Date().toISOString().slice(0, 10)}.xlsx`);
    setExporting(false);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    });

  const totalCategoryCount = stats?.categoryDistribution.reduce((s, c) => s + c.count, 0) || 1;
  const maxQuizDay = Math.max(...(stats?.quizzesByDay.map((d) => d.count) || [1]), 1);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-[#6B5B4F]" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-display font-bold text-[#2C1810]">Tổng quan</h1>
          <p className="text-sm text-[#6B5B4F] mt-0.5">
            Thống kê hệ thống ECHO — cập nhật {new Date().toLocaleString('vi-VN')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={fetchStats}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button size="sm" onClick={exportSummary} disabled={!stats || exporting}>
            <Download className="w-4 h-4" />
            {exporting ? 'Đang xuất...' : 'Xuất Excel'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {stats && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <StatCard
              label="Tổng người dùng"
              value={stats.totalUsers.toLocaleString('vi-VN')}
              sub={`+${stats.today.users} hôm nay`}
              icon={<Users className="w-5 h-5" />}
              color="#2563EB"
              href="/admin/users"
              delay={0}
            />
            <StatCard
              label="Tổng lượt Quiz"
              value={stats.totalQuizzes.toLocaleString('vi-VN')}
              sub={`${stats.usersWithQuizzes} người đã làm`}
              icon={<BarChart2 className="w-5 h-5" />}
              color="#059669"
              href="/admin/quiz-results"
              delay={0.05}
            />
            <StatCard
              label="Điểm TB"
              value={stats.avgScore}
              sub={`Phụ thuộc TB: ${stats.avgPercentage}%`}
              icon={<TrendingUp className="w-5 h-5" />}
              color="#D97706"
              delay={0.1}
            />
            <StatCard
              label="Hoàn thành quiz"
              value={`${stats.completionRate}%`}
              sub={`${stats.usersWithQuizzes}/${stats.totalUsers} người`}
              icon={<CheckCircle className="w-5 h-5" />}
              color="#9333EA"
              delay={0.15}
            />
          </div>

          {/* Period breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Card padding="md">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-[#5C4033]" />
                <h2 className="font-display font-semibold text-[#2C1810]">
                  Theo thời gian
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <PeriodBadge label="Hôm nay" users={stats.today.users} quizzes={stats.today.quizzes} />
                <PeriodBadge label="Tuần này" users={stats.week.users} quizzes={stats.week.quizzes} />
                <PeriodBadge label="Tháng này" users={stats.month.users} quizzes={stats.month.quizzes} />
              </div>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Category Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card padding="md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-[#5C4033]" />
                    <h2 className="font-display font-semibold text-[#2C1810]">
                      Phân bổ theo nhóm
                    </h2>
                  </div>
                  <Link
                    href="/admin/quiz-results"
                    className="flex items-center gap-1 text-xs text-[#5C4033] hover:underline"
                  >
                    Chi tiết
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                {stats.categoryDistribution.length === 0 ? (
                  <p className="text-sm text-[#6B5B4F] text-center py-6">Chưa có dữ liệu</p>
                ) : (
                  <div className="space-y-3">
                    {stats.categoryDistribution.map((item) => {
                      const pct = Math.round((item.count / totalCategoryCount) * 100);
                      return (
                        <div key={item.category}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-[#2C1810] font-medium">
                              {categoryNames[item.category] || item.category}
                            </span>
                            <span className="text-[#6B5B4F]">
                              {item.count} người ({pct}%)
                            </span>
                          </div>
                          <div className="h-2.5 bg-[#EDE4D3] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: categoryColors[item.category] || '#6B5B4F',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Top Users */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card padding="md">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-amber-500" />
                  <h2 className="font-display font-semibold text-[#2C1810]">
                    Người dùng tích cực nhất
                  </h2>
                </div>

                {stats.topUsers.length === 0 ? (
                  <p className="text-sm text-[#6B5B4F] text-center py-6">Chưa có dữ liệu</p>
                ) : (
                  <div className="space-y-2">
                    {stats.topUsers.map((user, i) => (
                      <div
                        key={user._id}
                        className="flex items-center gap-3 py-2 border-b border-[#EDE4D3] last:border-0"
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: i === 0 ? '#D97706' : i === 1 ? '#6B7280' : i === 2 ? '#92400E' : '#9CA3AF' }}
                        >
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#2C1810] truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-[#6B5B4F] truncate">{user.email}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <p className="text-xs font-semibold text-[#2C1810]">
                            {user.quizCount} quiz
                          </p>
                          <p className="text-xs text-[#6B5B4F]">
                            {formatDate(user.lastQuiz)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          {/* Quiz by day chart */}
          {stats.quizzesByDay.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mb-6"
            >
              <Card padding="md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#5C4033]" />
                    <h2 className="font-display font-semibold text-[#2C1810]">
                      Lượt Quiz 30 ngày gần đây
                    </h2>
                  </div>
                </div>

                <div className="flex items-end gap-0.5 h-32 overflow-hidden">
                  {stats.quizzesByDay.map((day) => {
                    const height = Math.max(4, Math.round((day.count / maxQuizDay) * 100));
                    return (
                      <div
                        key={day._id}
                        className="flex-1 flex flex-col items-center justify-end group relative"
                        title={`${day._id}: ${day.count} quiz`}
                      >
                        <div
                          className="w-full rounded-t-sm transition-all hover:opacity-80"
                          style={{
                            height: `${height}%`,
                            background: 'linear-gradient(to top, #059669, #34D399)',
                          }}
                        />
                        <span className="text-[9px] text-[#6B5B4F] mt-1 hidden group-hover:block absolute bottom-0 whitespace-nowrap bg-[#2C1810] text-white px-1 py-0.5 rounded z-10">
                          {day.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-[#6B5B4F]">
                    {formatDate(stats.quizzesByDay[0]?._id || '')}
                  </span>
                  <span className="text-xs text-[#6B5B4F]">
                    {formatDate(stats.quizzesByDay[stats.quizzesByDay.length - 1]?._id || '')}
                  </span>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card padding="md">
              <h2 className="font-display font-semibold text-[#2C1810] mb-3">
                Thao tác nhanh
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/admin/users">
                  <Card hoverable padding="md" className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-[#2C1810]">Quản lý người dùng</p>
                      <p className="text-xs text-[#6B5B4F]">{stats.totalUsers} tài khoản</p>
                    </div>
                  </Card>
                </Link>
                <Link href="/admin/quiz-results">
                  <Card hoverable padding="md" className="flex items-center gap-3">
                    <BarChart2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-[#2C1810]">Kết quả Quiz</p>
                      <p className="text-xs text-[#6B5B4F]">{stats.totalQuizzes} kết quả</p>
                    </div>
                  </Card>
                </Link>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}
