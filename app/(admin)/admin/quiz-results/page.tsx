'use client';

import { useEffect, useState } from 'react';
import { Download, RefreshCw, Search, Trash2 } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#2C1810]">Kết quả Quiz</h1>
          <p className="text-sm text-[#6B5B4F] mt-0.5">{total} kết quả</p>
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
            disabled={!total || exporting}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-[#059669] text-white hover:bg-[#047857] disabled:opacity-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Đang xuất...' : 'Xuất Excel'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5DCC8] p-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-4 h-4 text-[#6B5B4F]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo email/tên người dùng..."
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg border border-[#E5DCC8] bg-white focus:outline-none"
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
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E5DCC8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-[#E5DCC8] text-xs text-[#6B5B4F] uppercase">
                <th className="text-left px-4 py-3 font-medium w-10">#</th>
                <th className="text-left px-4 py-3 font-medium">Người dùng</th>
                <th className="text-left px-4 py-3 font-medium">Nhóm</th>
                <th className="text-right px-4 py-3 font-medium">Điểm</th>
                <th className="text-right px-4 py-3 font-medium">%</th>
                <th className="text-left px-4 py-3 font-medium">Ngày</th>
                <th className="text-right px-4 py-3 font-medium w-20"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[#6B5B4F]">
                    Đang tải...
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[#6B5B4F]">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                results.map((r, i) => (
                  <tr key={r._id} className="border-b border-[#F5EDE0] last:border-0 hover:bg-[#FAF6F0]">
                    <td className="px-4 py-3 text-[#6B5B4F]">{(page - 1) * limit + i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="text-[#2C1810] truncate max-w-[220px]">
                        {r.userId?.name || r.userId?.email?.split('@')[0] || '—'}
                      </div>
                      <div className="text-xs text-[#6B5B4F] truncate max-w-[220px]">
                        {r.userId?.email || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-xs text-white"
                        style={{ backgroundColor: CAT_COLOR[r.category] || '#6B5B4F' }}
                      >
                        {CAT_NAME[r.category] || r.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-[#2C1810]">{r.score}</td>
                    <td className="px-4 py-3 text-right font-semibold" style={{ color: CAT_COLOR[r.category] }}>
                      {r.percentage}%
                    </td>
                    <td className="px-4 py-3 text-[#6B5B4F] text-xs">
                      {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(r._id)}
                        disabled={deleting === r._id}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5DCC8] text-xs text-[#6B5B4F]">
            <span>
              {(page - 1) * limit + 1}–{Math.min(page * limit, total)} / {total}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded border border-[#E5DCC8] bg-white disabled:opacity-50"
              >
                Trước
              </button>
              <span className="px-3 py-1">
                {page}/{totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded border border-[#E5DCC8] bg-white disabled:opacity-50"
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
