'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, Trash2, RefreshCw, Loader2 } from 'lucide-react';
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

  const limit = 15;

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search ? { search } : {}),
        ...(category ? { category } : {}),
      });
      const res = await fetch(`/api/admin/quiz-results?${params}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.data.results);
        setTotal(data.data.total);
        setTotalPages(data.data.totalPages);
      } else {
        setError(data.error || 'Không thể tải dữ liệu');
      }
    } catch {
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa kết quả này?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/quiz-results?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setResults((prev) => prev.filter((r) => r._id !== id));
        setTotal((prev) => prev - 1);
      } else {
        alert(data.error || 'Xóa thất bại');
      }
    } catch {
      alert('Lỗi kết nối');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const categories = ['seed_keeper', 'walker', 'supported', 'hidden_dependent', 'ai_living'];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-[#2C1810]">
            Kết quả Quiz
          </h1>
          <p className="text-sm text-[#6B5B4F] mt-0.5">
            {total} kết quả
          </p>
        </div>
        <button
          onClick={fetchResults}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-[#6B5B4F] hover:bg-[#F5EDE0] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Filters */}
      <Card padding="md" className="mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-4 h-4 text-[#6B5B4F] flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo email/tên người dùng..."
              className="flex-1 bg-transparent text-sm text-[#2C1810] placeholder:text-[#6B5B4F] focus:outline-none"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border-2 border-[#EDE4D3] bg-white text-sm text-[#2C1810] focus:outline-none focus:border-[#5C4033]"
          >
            <option value="">Tất cả nhóm</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {categoryNames[cat] || cat}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EDE4D3]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B5B4F] uppercase tracking-wide">
                  Người dùng
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B5B4F] uppercase tracking-wide">
                  Nhóm
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B5B4F] uppercase tracking-wide">
                  Điểm
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B5B4F] uppercase tracking-wide">
                  %
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B5B4F] uppercase tracking-wide">
                  Ngày
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B5B4F] uppercase tracking-wide">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#6B5B4F]" />
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-[#6B5B4F]">
                    Không có kết quả nào
                  </td>
                </tr>
              ) : (
                results.map((result) => (
                  <tr
                    key={result._id}
                    className="border-b border-[#EDE4D3] last:border-0 hover:bg-[#FAF6F0] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-[#2C1810]">
                        {result.userId?.name || result.userId?.email?.split('@')[0] || 'Người dùng'}
                      </p>
                      <p className="text-xs text-[#6B5B4F]">
                        {result.userId?.email || '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: categoryColors[result.category] || '#6B5B4F' }}
                      >
                        {categoryNames[result.category] || result.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-[#2C1810]">
                      {result.score}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: categoryColors[result.category] }}
                      >
                        {result.percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#6B5B4F]">
                      {formatDate(result.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(result._id)}
                        disabled={deleting === result._id}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {deleting === result._id ? 'Đang xóa...' : 'Xóa'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#EDE4D3]">
            <p className="text-xs text-[#6B5B4F]">
              Hiển thị {(page - 1) * limit + 1}–{Math.min(page * limit, total)} trong {total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg hover:bg-[#F5EDE0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-[#6B5B4F]" />
              </button>
              <span className="px-2 py-1 text-xs font-medium text-[#2C1810]">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg hover:bg-[#F5EDE0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-[#6B5B4F]" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
