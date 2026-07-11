'use client';

import { useEffect, useState } from 'react';
import { Download, RefreshCw, Search, Trash2, FileText } from 'lucide-react';
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
const CATS = ['seed_keeper', 'walker', 'supported', 'hidden_dependent', 'ai_living'];

interface QuizResult {
  _id: string;
  score: number;
  percentage: number;
  category: string;
  createdAt: string;
  userId: { name?: string; email: string } | null;
}

export default function AdminQuizResultsPage() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const limit = 15;

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
        category,
      });
      const res = await fetch(`/api/admin/quiz-results?${params}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setResults(data.data.results);
      setTotal(data.data.total);
      setTotalPages(data.data.totalPages);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, search, category]);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa kết quả này?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/quiz-results?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setResults((p) => p.filter((r) => r._id !== id));
      setTotal((p) => p - 1);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Xóa thất bại');
    } finally {
      setDeleting(null);
    }
  };

  const exportExcel = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '10000',
        search,
        category,
      });
      const res = await fetch(`/api/admin/quiz-results?${params}`);
      const data = await res.json();
      if (!data.success) throw new Error();

      const rows = data.data.results.map((r: QuizResult, i: number) => ({
        STT: i + 1,
        'Họ tên': r.userId?.name || '',
        Email: r.userId?.email || '',
        'Nhóm': CAT_NAME[r.category] || r.category,
        'Điểm': r.score,
        'Phụ thuộc (%)': r.percentage,
        'Ngày làm': new Date(r.createdAt).toLocaleString('vi-VN'),
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(rows);
      ws['!cols'] = [
        { wch: 6 },
        { wch: 25 },
        { wch: 35 },
        { wch: 22 },
        { wch: 8 },
        { wch: 15 },
        { wch: 22 },
      ];
      XLSX.utils.book_append_sheet(wb, ws, 'Kết quả Quiz');
      XLSX.writeFile(wb, `echo-quiz-results-${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch {
      alert('Xuất thất bại');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold" style={{ color: 'var(--echo-ink)' }}>Kết quả Quiz</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--echo-ink-muted)' }}>{total} kết quả</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={load}
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
            disabled={!total || exporting}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all shadow-md disabled:opacity-50"
            style={{ backgroundColor: 'var(--echo-wood)', color: 'white' }}
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Đang xuất...' : 'Xuất Excel'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl p-3 mb-6 shadow-sm" style={{ backgroundColor: 'white' }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5" style={{ color: 'var(--echo-ink-muted)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo email/tên người dùng..."
              className="flex-1 bg-transparent text-sm focus:outline-none"
              style={{ color: 'var(--echo-ink)' }}
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 text-sm rounded-xl border-2 focus:outline-none transition-all"
            style={{ 
              borderColor: 'var(--echo-parchment-dark)', 
              color: 'var(--echo-ink)',
              backgroundColor: 'white'
            }}
          >
            <option value="">Tất cả nhóm</option>
            {CATS.map((c) => (
              <option key={c} value={c}>
                {CAT_NAME[c]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl border-2" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', color: '#DC2626' }}>
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl overflow-hidden shadow-md" style={{ backgroundColor: 'white' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--echo-parchment-light)' }}>
                <th className="text-left px-5 py-4 font-semibold w-12" style={{ color: 'var(--echo-ink)' }}>#</th>
                <th className="text-left px-5 py-4 font-semibold" style={{ color: 'var(--echo-ink)' }}>Người dùng</th>
                <th className="text-left px-5 py-4 font-semibold" style={{ color: 'var(--echo-ink)' }}>Nhóm</th>
                <th className="text-right px-5 py-4 font-semibold" style={{ color: 'var(--echo-ink)' }}>Điểm</th>
                <th className="text-right px-5 py-4 font-semibold" style={{ color: 'var(--echo-ink)' }}>%</th>
                <th className="text-left px-5 py-4 font-semibold" style={{ color: 'var(--echo-ink)' }}>Ngày</th>
                <th className="text-right px-5 py-4 font-semibold w-24" style={{ color: 'var(--echo-ink)' }}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="w-6 h-6 rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--echo-parchment)', borderTopColor: 'var(--echo-wood)' }} />
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center" style={{ color: 'var(--echo-ink-muted)' }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                results.map((r, i) => (
                  <tr 
                    key={r._id} 
                    className="border-t transition-colors"
                    style={{ borderColor: 'var(--echo-parchment)' }}
                  >
                    <td className="px-5 py-4" style={{ color: 'var(--echo-ink-muted)' }}>{(page - 1) * limit + i + 1}</td>
                    <td className="px-5 py-4">
                      <div className="truncate max-w-[200px]" style={{ color: 'var(--echo-ink)' }}>
                        {r.userId?.name || r.userId?.email?.split('@')[0] || '—'}
                      </div>
                      <div className="text-xs truncate max-w-[200px]" style={{ color: 'var(--echo-ink-muted)' }}>
                        {r.userId?.email || '—'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-block px-3 py-1.5 rounded-full text-xs text-white font-medium"
                        style={{ backgroundColor: CAT_COLOR[r.category] || '#6B5B4F' }}
                      >
                        {CAT_NAME[r.category] || r.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-bold" style={{ color: 'var(--echo-ink)' }}>{r.score}</td>
                    <td className="px-5 py-4 text-right font-bold" style={{ color: CAT_COLOR[r.category] }}>{r.percentage}%</td>
                    <td className="px-5 py-4 text-xs" style={{ color: 'var(--echo-ink-muted)' }}>
                      {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(r._id)}
                        disabled={deleting === r._id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors disabled:opacity-50"
                        style={{ color: '#DC2626', backgroundColor: '#FEE2E2' }}
                      >
                        <Trash2 className="w-4 h-4" />
                        {deleting === r._id ? '...' : 'Xóa'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t" style={{ borderColor: 'var(--echo-parchment)' }}>
            <span className="text-sm" style={{ color: 'var(--echo-ink-muted)' }}>
              {(page - 1) * limit + 1}–{Math.min(page * limit, total)} / {total}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm rounded-xl border-2 transition-all disabled:opacity-50"
                style={{ backgroundColor: 'white', borderColor: 'var(--echo-parchment-dark)', color: 'var(--echo-ink)' }}
              >
                Trước
              </button>
              <span className="px-4 py-2 text-sm font-medium" style={{ color: 'var(--echo-ink)' }}>
                {page}/{totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm rounded-xl border-2 transition-all disabled:opacity-50"
                style={{ backgroundColor: 'white', borderColor: 'var(--echo-parchment-dark)', color: 'var(--echo-ink)' }}
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
