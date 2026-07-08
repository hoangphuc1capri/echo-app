'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, Trash2, RefreshCw, Loader2, Download } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import * as XLSX from 'xlsx';

interface User {
  _id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const limit = 15;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search ? { search } : {}),
      });
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data.users);
        setTotal(data.data.total);
        setTotalPages(data.data.totalPages);
      } else {
        setError(data.error || 'Không thể tải danh sách');
      }
    } catch {
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa người dùng này? Tất cả kết quả quiz của họ cũng sẽ bị xóa.')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
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

  const exportAll = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams({ page: '1', limit: '10000', ...(search ? { search } : {}) });
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      if (!data.success) throw new Error();

      const rows = data.data.users.map((u: User, i: number) => ({
        STT: i + 1,
        'Họ tên': u.name || '',
        Email: u.email,
        'Ngày đăng ký': new Date(u.createdAt).toLocaleString('vi-VN'),
        'Số quiz': '—',
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(rows);
      ws['!cols'] = [
        { wch: 6 },
        { wch: 25 },
        { wch: 35 },
        { wch: 25 },
        { wch: 10 },
      ];
      XLSX.utils.book_append_sheet(wb, ws, 'Người dùng');
      XLSX.writeFile(wb, `echo-users-${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch {
      alert('Xuất thất bại');
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-[#2C1810]">Người dùng</h1>
          <p className="text-sm text-[#6B5B4F] mt-0.5">{total} tài khoản đã đăng ký</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={fetchUsers}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button size="sm" onClick={exportAll} disabled={!total || exporting}>
            <Download className="w-4 h-4" />
            {exporting ? 'Đang xuất...' : 'Xuất Excel'}
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card padding="md" className="mb-4">
        <div className="flex items-center gap-3">
          <Search className="w-4 h-4 text-[#6B5B4F] flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo email hoặc tên..."
            className="flex-1 bg-transparent text-sm text-[#2C1810] placeholder:text-[#6B5B4F] focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-xs text-[#6B5B4F] hover:text-[#2C1810]"
            >
              Xóa
            </button>
          )}
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B5B4F] uppercase tracking-wide w-10">STT</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B5B4F] uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B5B4F] uppercase tracking-wide">Tên</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B5B4F] uppercase tracking-wide">Ngày đăng ký</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B5B4F] uppercase tracking-wide">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#6B5B4F]" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-[#6B5B4F]">
                    Không có người dùng nào
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr
                    key={user._id}
                    className="border-b border-[#EDE4D3] last:border-0 hover:bg-[#FAF6F0] transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-[#6B5B4F]">{(page - 1) * limit + idx + 1}</td>
                    <td className="px-4 py-3 text-sm text-[#2C1810]">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-[#2C1810]">
                      {user.name || <span className="text-[#6B5B4F] italic">Chưa có</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#6B5B4F]">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        disabled={deleting === user._id}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {deleting === user._id ? 'Đang xóa...' : 'Xóa'}
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
