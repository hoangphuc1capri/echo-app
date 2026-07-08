'use client';

import { useEffect, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
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

    // Sheet 1: Tổng quan
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

    // Sheet 2: Phân bổ nhóm
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

    // Sheet 3: Top users
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

    // Sheet 4: Quiz 30 ngày
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

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-64 text-[#6B5B4F]">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#2C1810]">Tổng quan</h1>
          <p className="text-sm text-[#6B5B4F] mt-0.5">
            Số liệu thật từ hệ thống • Cập nhật {new Date().toLocaleString('vi-VN')}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-[#E5DCC8] bg-white hover:bg-[#F5EDE0] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
          <button
            onClick={exportExcel}
            disabled={!stats}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-[#059669] text-white hover:bg-[#047857] disabled:opacity-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Xuất Excel
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {stats && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <Kpi
              label="Tổng người dùng"
              value={stats.totals.users.toLocaleString('vi-VN')}
              sub={`+${stats.periods.day.users} hôm nay`}
              color="#2563EB"
            />
            <Kpi
              label="Tổng lượt quiz"
              value={stats.totals.quizzes.toLocaleString('vi-VN')}
              sub={`${stats.totals.usersWithQuiz} người đã làm`}
              color="#059669"
            />
            <Kpi
              label="Điểm trung bình"
              value={stats.totals.avgScore}
              sub={`Phụ thuộc: ${stats.totals.avgPercentage}%`}
              color="#D97706"
            />
            <Kpi
              label="Tỷ lệ hoàn thành"
              value={`${stats.totals.completionRate}%`}
              sub={`${stats.totals.usersWithQuiz}/${stats.totals.users} người`}
              color="#9333EA"
            />
          </div>

          {/* Period breakdown */}
          <div className="bg-white rounded-xl border border-[#E5DCC8] p-4 mb-5">
            <h2 className="text-sm font-semibold text-[#2C1810] mb-3">Theo thời gian</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-[#6B5B4F] uppercase">
                  <th className="text-left font-medium pb-2">Khoảng</th>
                  <th className="text-right font-medium pb-2">Người dùng mới</th>
                  <th className="text-right font-medium pb-2">Lượt quiz</th>
                </tr>
              </thead>
              <tbody>
                <Row label="Hôm nay" users={stats.periods.day.users} quizzes={stats.periods.day.quizzes} />
                <Row label="Tuần này" users={stats.periods.week.users} quizzes={stats.periods.week.quizzes} />
                <Row label="Tháng này" users={stats.periods.month.users} quizzes={stats.periods.month.quizzes} />
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
            {/* Category distribution */}
            <div className="bg-white rounded-xl border border-[#E5DCC8] p-4">
              <h2 className="text-sm font-semibold text-[#2C1810] mb-3">Phân bổ theo nhóm</h2>
              {stats.categories.length === 0 ? (
                <p className="text-sm text-[#6B5B4F] text-center py-4">Chưa có dữ liệu</p>
              ) : (
                <div className="space-y-2.5">
                  {stats.categories.map((c) => {
                    const total = stats.categories.reduce((s, x) => s + x.count, 0) || 1;
                    const pct = Math.round((c.count / total) * 100);
                    return (
                      <div key={c.category}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#2C1810] font-medium">
                            {CAT_NAME[c.category] || c.category}
                          </span>
                          <span className="text-[#6B5B4F]">
                            {c.count} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 bg-[#F5EDE0] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
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

            {/* Top users */}
            <div className="bg-white rounded-xl border border-[#E5DCC8] p-4">
              <h2 className="text-sm font-semibold text-[#2C1810] mb-3">Top 10 người tích cực</h2>
              {stats.topUsers.length === 0 ? (
                <p className="text-sm text-[#6B5B4F] text-center py-4">Chưa có dữ liệu</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-[#6B5B4F] uppercase border-b border-[#E5DCC8]">
                      <th className="text-left font-medium py-2 w-8">#</th>
                      <th className="text-left font-medium py-2">Tên</th>
                      <th className="text-right font-medium py-2">Quiz</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topUsers.map((u, i) => (
                      <tr key={u._id} className="border-b border-[#F5EDE0] last:border-0">
                        <td className="py-2 text-[#6B5B4F]">{i + 1}</td>
                        <td className="py-2">
                          <div className="text-[#2C1810] truncate max-w-[200px]">{u.name}</div>
                          <div className="text-xs text-[#6B5B4F] truncate max-w-[200px]">{u.email}</div>
                        </td>
                        <td className="py-2 text-right font-semibold text-[#2C1810]">{u.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Quiz 30 days bar chart */}
          {stats.quizzesByDay.length > 0 && (
            <div className="bg-white rounded-xl border border-[#E5DCC8] p-4">
              <h2 className="text-sm font-semibold text-[#2C1810] mb-3">Lượt quiz 30 ngày qua</h2>
              <div className="flex items-end gap-px h-32">
                {stats.quizzesByDay.map((d) => {
                  const max = Math.max(...stats.quizzesByDay.map((x) => x.count), 1);
                  const h = Math.max(4, Math.round((d.count / max) * 100));
                  return (
                    <div
                      key={d._id}
                      className="flex-1 rounded-t bg-emerald-500 hover:bg-emerald-600 transition-colors"
                      style={{ height: `${h}%` }}
                      title={`${d._id}: ${d.count} quiz`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-[#6B5B4F] mt-1">
                <span>{stats.quizzesByDay[0]?._id}</span>
                <span>{stats.quizzesByDay[stats.quizzesByDay.length - 1]?._id}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Kpi({ label, value, sub, color }: { label: string; value: string | number; sub: string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#E5DCC8] p-4">
      <p className="text-xs font-medium" style={{ color }}>{label}</p>
      <p className="text-2xl font-bold text-[#2C1810] mt-1">{value}</p>
      <p className="text-xs text-[#6B5B4F] mt-0.5">{sub}</p>
    </div>
  );
}

function Row({ label, users, quizzes }: { label: string; users: number; quizzes: number }) {
  return (
    <tr className="border-t border-[#F5EDE0]">
      <td className="py-2 text-[#2C1810]">{label}</td>
      <td className="py-2 text-right text-[#2C1810] font-medium">{users.toLocaleString('vi-VN')}</td>
      <td className="py-2 text-right text-[#2C1810] font-medium">{quizzes.toLocaleString('vi-VN')}</td>
    </tr>
  );
}
