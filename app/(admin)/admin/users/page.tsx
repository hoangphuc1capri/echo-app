'use client';

import { useEffect, useState } from 'react';
import { Download, RefreshCw, Search, Trash2, Plus, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

interface User {
  _id: string;
  email: string;
  name?: string;
  role?: 'admin' | 'user';
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
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [adminForm, setAdminForm] = useState({ email: '', password: '', name: '' });
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [adminError, setAdminError] = useState('');

  const limit = 15;

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
      });
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setUsers(data.data.users);
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
  }, [page, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa user này và tất cả kết quả quiz?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setUsers((p) => p.filter((u) => u._id !== id));
      setTotal((p) => p - 1);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Xóa thất bại');
    } finally {
      setDeleting(null);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingAdmin(true);
    setAdminError('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminForm),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setShowCreateAdmin(false);
      setAdminForm({ email: '', password: '', name: '' });
      alert('Tạo tài khoản admin thành công!');
    } catch (e) {
      setAdminError(e instanceof Error ? e.message : 'Tạo thất bại');
    } finally {
      setCreatingAdmin(false);
    }
  };

  const exportExcel = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams({ page: '1', limit: '10000', search });
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      if (!data.success) throw new Error();

      const rows = data.data.users.map((u: User, i: number) => ({
        STT: i + 1,
        Email: u.email,
        'Họ tên': u.name || '',
        'Ngày đăng ký': new Date(u.createdAt).toLocaleString('vi-VN'),
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(rows);
      ws['!cols'] = [{ wch: 6 }, { wch: 35 }, { wch: 25 }, { wch: 22 }];
      XLSX.utils.book_append_sheet(wb, ws, 'Người dùng');
      XLSX.writeFile(wb, `echo-users-${new Date().toISOString().slice(0, 10)}.xlsx`);
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
          <h1 className="text-2xl font-display font-bold text-[#2C1810]">Người dùng</h1>
          <p className="text-sm text-[#6B5B4F] mt-0.5">{total} tài khoản</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateAdmin(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-[#5C4033] text-white hover:bg-[#4A3328] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tạo Admin
          </button>
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
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-[#6B5B4F]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo email hoặc tên..."
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-xs text-[#6B5B4F]">
              Xóa
            </button>
          )}
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
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Tên</th>
                <th className="text-left px-4 py-3 font-medium">Ngày đăng ký</th>
                <th className="text-right px-4 py-3 font-medium w-20"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-[#6B5B4F]">
                    Đang tải...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-[#6B5B4F]">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                users.map((u, i) => (
                  <tr key={u._id} className="border-b border-[#F5EDE0] last:border-0 hover:bg-[#FAF6F0]">
                    <td className="px-4 py-3 text-[#6B5B4F]">{(page - 1) * limit + i + 1}</td>
                    <td className="px-4 py-3 text-[#2C1810]">{u.email}</td>
                    <td className="px-4 py-3 text-[#2C1810]">
                      {u.name || <span className="text-[#6B5B4F] italic">—</span>}
                    </td>
                    <td className="px-4 py-3 text-[#6B5B4F]">
                      {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(u._id)}
                        disabled={deleting === u._id}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {deleting === u._id ? '...' : 'Xóa'}
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

      {/* Create Admin Modal */}
      {showCreateAdmin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <Card variant="elevated" padding="lg" className="w-full max-w-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-bold text-[#2C1810]">Tạo tài khoản Admin</h2>
              <button
                onClick={() => setShowCreateAdmin(false)}
                className="p-1 hover:bg-[#F5EDE0] rounded"
              >
                <X className="w-5 h-5 text-[#6B5B4F]" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <Input
                type="text"
                label="Email"
                placeholder="admin@example.com"
                value={adminForm.email}
                onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                required
              />
              <Input
                type="text"
                label="Tên"
                placeholder="Tên admin"
                value={adminForm.name}
                onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
              />
              <Input
                type="password"
                label="Mật khẩu"
                placeholder="Ít nhất 6 ký tự"
                value={adminForm.password}
                onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                required
              />

              {adminError && (
                <p className="text-sm text-red-600">{adminError}</p>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateAdmin(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={creatingAdmin}
                  className="flex-1"
                >
                  Tạo Admin
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
