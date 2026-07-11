'use client';

import { useEffect, useState } from 'react';
import { Download, RefreshCw, Users, FileText, Target, Award, Calendar, TrendingUp } from 'lucide-react';
import * as XLSX from 'xlsx';

const CAT_NAME: Record<string, string> = {
  seed_keeper: 'Người giữ lửa',
  walker: 'Người đi trên cầu',
  supported: 'Người thích hỗ trợ',
  hidden_dependent: 'Người phụ thuộc ẩn',
  ai_living: 'Người sống cùng AI',
};
const CAT_COLOR: Record<string, string> = {
  seed_keeper: '#059669',
  walker: '#D97706',
  supported: '#2563EB',
  hidden_dependent: '#DC2626',
  ai_living: '#9333EA',
};

interface Stats {
  totals: {
    users: number;
    quizzes: number;
    usersWithQuiz: number;
    completionRate: number;
    avgScore: number;
    avgPercentage: number;
  };
  periods: {
    day: { users: number; quizzes: number };
    week: { users: number; quizzes: number };
    month: { users: number; quizzes: number };
  };
  categories: { category: string; count: number }[];
  quizzesByDay: { _id: string; count: number }[];
  topUsers: { _id: string; count: number; name: string; email: string; lastAt: string }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Lỗi');
      setStats(data.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const exportExcel = () => {
    if (!stats) return;
    const wb = XLSX.utils.book_new();

    const overview = [
      ['BÁO CÁO TỔNG QUAN ECHO'],
      ['Ngày xuất', new Date().toLocaleString('vi-VN')],
      [],
      ['Chỉ số', 'Giá trị'],
      ['Tổng người dùng', stats.totals.users],
      ['Tổng lượt quiz', stats.totals.quizzes],
      ['Người đã làm quiz', stats.totals.usersWithQuiz],
      ['Tỷ lệ hoàn thành (%)', stats.totals.completionRate],
      ['Điểm trung bình', stats.totals.avgScore],
      ['% phụ thuộc trung bình', stats.totals.avgPercentage],
      [],
      ['Theo thời gian', 'Người dùng mới', 'Lượt quiz'],
      ['Hôm nay', stats.periods.day.users, stats.periods.day.quizzes],
      ['Tuần này', stats.periods.week.users, stats.periods.week.quizzes],
      ['Tháng này', stats.periods.month.users, stats.periods.month.quizzes],
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 28 }, { wch: 20 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Tổng quan');

    const totalQuiz = stats.categories.reduce((s, c) => s + c.count, 0) || 1;
    const cats = [
      ['Nhóm', 'Số lượt quiz', 'Tỷ lệ (%)'],
      ...stats.categories.map((c) => [
        CAT_NAME[c.category] || c.category,
        c.count,
        Math.round((c.count / totalQuiz) * 100),
      ]),
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(cats);
    ws2['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Phân bổ nhóm');

    if (stats.topUsers.length) {
      const top = [
        ['Top người dùng tích cực'],
        ['#', 'Tên', 'Email', 'Số quiz', 'Quiz gần nhất'],
        ...stats.topUsers.map((u, i) => [
          i + 1,
          u.name,
          u.email,
          u.count,
          new Date(u.lastAt).toLocaleString('vi-VN'),
        ]),
      ];
      const ws3 = XLSX.utils.aoa_to_sheet(top);
      ws3['!cols'] = [{ wch: 5 }, { wch: 25 }, { wch: 30 }, { wch: 10 }, { wch: 22 }];
      XLSX.utils.book_append_sheet(wb, ws3, 'Top users');
    }

    if (stats.quizzesByDay.length) {
      const days = [
        ['Ngày', 'Số quiz'],
        ...stats.quizzesByDay.map((d) => [d._id, d.count]),
      ];
      const ws4 = XLSX.utils.aoa_to_sheet(days);
      ws4['!cols'] = [{ wch: 15 }, { wch: 12 }];
      XLSX.utils.book_append_sheet(wb, ws4, 'Quiz 30 ngày');
    }

    XLSX.writeFile(wb, `echo-admin-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold" style={{ color: 'var(--echo-ink)' }}>Tổng quan</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--echo-ink-muted)' }}>
            Số liệu hệ thống • Cập nhật {new Date().toLocaleString('vi-VN')}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border-2 transition-all disabled:opacity-50"
            style={{ 
              backgroundColor: 'white', 
              borderColor: 'var(--echo-parchment-dark)',
              color: 'var(--echo-ink)'
            }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
          <button
            onClick={exportExcel}
            disabled={!stats}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all shadow-md disabled:opacity-50"
            style={{ 
              backgroundColor: 'var(--echo-wood)', 
              color: 'white'
            }}
          >
            <Download className="w-4 h-4" />
            Xuất Excel
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl border-2" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', color: '#DC2626' }}>
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {loading && !stats && (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 rounded-full animate-spin" style={{ borderColor: 'var(--echo-parchment-dark)', borderTopColor: 'var(--echo-wood)' }} />
        </div>
      )}

      {stats && (
        <>
          {/* KPI Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KpiCard
              icon={Users}
              label="Người dùng"
              value={stats.totals.users.toLocaleString('vi-VN')}
              sub={`+${stats.periods.day.users} hôm nay`}
              color="var(--echo-wood)"
            />
            <KpiCard
              icon={FileText}
              label="Lượt Quiz"
              value={stats.totals.quizzes.toLocaleString('vi-VN')}
              sub={`${stats.totals.usersWithQuiz} đã làm`}
              color="var(--echo-amber)"
            />
            <KpiCard
              icon={Target}
              label="Điểm TB"
              value={stats.totals.avgScore}
              sub={`Phụ thuộc ${stats.totals.avgPercentage}%`}
              color="#059669"
            />
            <KpiCard
              icon={Award}
              label="Hoàn thành"
              value={`${stats.totals.completionRate}%`}
              sub={`${stats.totals.usersWithQuiz}/${stats.totals.users}`}
              color="#2563EB"
            />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Period Stats */}
            <div className="rounded-2xl p-5 shadow-md" style={{ backgroundColor: 'white' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--echo-amber-light)' }}>
                  <Calendar className="w-5 h-5" style={{ color: 'var(--echo-amber)' }} />
                </div>
                <h2 className="text-lg font-display font-bold" style={{ color: 'var(--echo-ink)' }}>Theo thời gian</h2>
              </div>
              <div className="space-y-3">
                <PeriodRow label="Hôm nay" users={stats.periods.day.users} quizzes={stats.periods.day.quizzes} />
                <PeriodRow label="Tuần này" users={stats.periods.week.users} quizzes={stats.periods.week.quizzes} />
                <PeriodRow label="Tháng này" users={stats.periods.month.users} quizzes={stats.periods.month.quizzes} />
              </div>
            </div>

            {/* Category Distribution */}
            <div className="rounded-2xl p-5 shadow-md lg:col-span-2" style={{ backgroundColor: 'white' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                  <TrendingUp className="w-5 h-5" style={{ color: '#2563EB' }} />
                </div>
                <h2 className="text-lg font-display font-bold" style={{ color: 'var(--echo-ink)' }}>Phân bổ nhóm</h2>
              </div>
              {stats.categories.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: 'var(--echo-ink-muted)' }}>Chưa có dữ liệu</p>
              ) : (
                <div className="space-y-4">
                  {stats.categories.map((c) => {
                    const total = stats.categories.reduce((s, x) => s + x.count, 0) || 1;
                    const pct = Math.round((c.count / total) * 100);
                    return (
                      <div key={c.category}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium" style={{ color: 'var(--echo-ink)' }}>
                            {CAT_NAME[c.category] || c.category}
                          </span>
                          <span className="text-sm" style={{ color: 'var(--echo-ink-muted)' }}>
                            {c.count} ({pct}%)
                          </span>
                        </div>
                        <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--echo-parchment)' }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: CAT_COLOR[c.category] || '#6B5B4F',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Top Users & Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Users */}
            <div className="rounded-2xl p-5 shadow-md" style={{ backgroundColor: 'white' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                  <Award className="w-5 h-5" style={{ color: 'var(--echo-amber)' }} />
                </div>
                <h2 className="text-lg font-display font-bold" style={{ color: 'var(--echo-ink)' }}>Top tích cực</h2>
              </div>
              {stats.topUsers.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: 'var(--echo-ink-muted)' }}>Chưa có dữ liệu</p>
              ) : (
                <div className="space-y-2">
                  {stats.topUsers.map((u, i) => (
                    <div
                      key={u._id}
                      className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                      style={{ backgroundColor: 'var(--echo-parchment-light)' }}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        i === 0 ? '' : i === 1 ? '' : i === 2 ? '' : ''
                      }`}
                      style={i === 0 ? { backgroundColor: '#B45309', color: 'white' } : 
                             i === 1 ? { backgroundColor: '#78716C', color: 'white' } :
                             i === 2 ? { backgroundColor: '#B87333', color: 'white' } :
                             { backgroundColor: 'var(--echo-parchment)', color: 'var(--echo-ink-muted)' }}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--echo-ink)' }}>{u.name}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--echo-ink-muted)' }}>{u.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: 'var(--echo-wood)' }}>{u.count}</p>
                        <p className="text-xs" style={{ color: 'var(--echo-ink-muted)' }}>quiz</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 30 Days Chart */}
            <div className="rounded-2xl p-5 shadow-md" style={{ backgroundColor: 'white' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
                  <TrendingUp className="w-5 h-5" style={{ color: '#059669' }} />
                </div>
                <h2 className="text-lg font-display font-bold" style={{ color: 'var(--echo-ink)' }}>30 ngày qua</h2>
              </div>
              {stats.quizzesByDay.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: 'var(--echo-ink-muted)' }}>Chưa có dữ liệu</p>
              ) : (
                <div className="flex items-end gap-px h-40">
                  {stats.quizzesByDay.map((d) => {
                    const max = Math.max(...stats.quizzesByDay.map((x) => x.count), 1);
                    const h = Math.max(4, Math.round((d.count / max) * 100));
                    return (
                      <div
                        key={d._id}
                        className="flex-1 rounded-t-sm transition-all cursor-pointer"
                        style={{ 
                          height: `${h}%`,
                          background: 'linear-gradient(180deg, var(--echo-wood) 0%, var(--echo-amber) 100%)'
                        }}
                        title={`${d._id}: ${d.count}`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string | number; sub: string; color: string }) {
  return (
    <div className="rounded-2xl p-5 shadow-md hover:shadow-lg transition-all" style={{ backgroundColor: 'white' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
      <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--echo-ink-muted)' }}>{label}</p>
      <p className="text-2xl font-display font-bold" style={{ color: 'var(--echo-ink)' }}>{value}</p>
      <p className="text-xs mt-1" style={{ color: 'var(--echo-ink-muted)' }}>{sub}</p>
    </div>
  );
}

function PeriodRow({ label, users, quizzes }: { label: string; users: number; quizzes: number }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: 'var(--echo-parchment-light)' }}>
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--echo-ink)' }}>{label}</p>
        <p className="text-xs" style={{ color: 'var(--echo-ink-muted)' }}>{users} người dùng</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold" style={{ color: 'var(--echo-wood)' }}>{quizzes}</p>
        <p className="text-xs" style={{ color: 'var(--echo-ink-muted)' }}>quiz</p>
      </div>
    </div>
  );
}
