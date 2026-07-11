'use client';

import { useEffect, useState } from 'react';
import { Download, RefreshCw, Search, Trash2, Plus, X, UserPlus } from 'lucide-react';
import * as XLSX from 'xlsx';

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
      load();
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold" style={{ color: 'var(--echo-ink)' }}>Người dùng</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--echo-ink-muted)' }}>{total} tài khoản</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateAdmin(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all"
            style={{ backgroundColor: 'var(--echo-ink)', color: 'white' }}
          >
            <UserPlus className="w-4 h-4" />
            Tạo Admin
          </button>
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

      {/* Search */}
      <div className="rounded-xl p-3 mb-6 shadow-sm" style={{ backgroundColor: 'white' }}>
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5" style={{ color: 'var(--echo-ink-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo email hoặc tên..."
            className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ color: 'var(--echo-ink)' }}
          />
          {search && (
            <button 
              onClick={() => setSearch('')} 
              className="text-xs px-2 py-1 rounded-lg transition-colors"
              style={{ color: 'var(--echo-ink-muted)', backgroundColor: 'var(--echo-parchment)' }}
            >
              Xóa
            </button>
          )}
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
                <th className="text-left px-5 py-4 font-semibold" style={{ color: 'var(--echo-ink)' }}>Email</th>
                <th className="text-left px-5 py-4 font-semibold" style={{ color: 'var(--echo-ink)' }}>Tên</th>
                <th className="text-left px-5 py-4 font-semibold" style={{ color: 'var(--echo-ink)' }}>Ngày đăng ký</th>
                <th className="text-right px-5 py-4 font-semibold w-24" style={{ color: 'var(--echo-ink)' }}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <div className="w-6 h-6 rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--echo-parchment)', borderTopColor: 'var(--echo-wood)' }} />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center" style={{ color: 'var(--echo-ink-muted)' }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                users.map((u, i) => (
                  <tr 
                    key={u._id} 
                    className="border-t transition-colors"
                    style={{ borderColor: 'var(--echo-parchment)' }}
                  >
                    <td className="px-5 py-4" style={{ color: 'var(--echo-ink-muted)' }}>{(page - 1) * limit + i + 1}</td>
                    <td className="px-5 py-4" style={{ color: 'var(--echo-ink)' }}>{u.email}</td>
                    <td className="px-5 py-4" style={{ color: 'var(--echo-ink)' }}>
                      {u.name || <span className="italic" style={{ color: 'var(--echo-ink-muted)' }}>—</span>}
                    </td>
                    <td className="px-5 py-4" style={{ color: 'var(--echo-ink-muted)' }}>
                      {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(u._id)}
                        disabled={deleting === u._id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors disabled:opacity-50"
                        style={{ color: '#DC2626', backgroundColor: '#FEE2E2' }}
                      >
                        <Trash2 className="w-4 h-4" />
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

      {/* Create Admin Modal */}
      {showCreateAdmin && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: 'white' }}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--echo-parchment)' }}>
              <h2 className="text-lg font-display font-bold" style={{ color: 'var(--echo-ink)' }}>Tạo tài khoản Admin</h2>
              <button
                onClick={() => setShowCreateAdmin(false)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--echo-parchment-light)' }}
              >
                <X className="w-5 h-5" style={{ color: 'var(--echo-ink-muted)' }} />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--echo-ink)' }}>Email</label>
                <input
                  type="email"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  placeholder="admin@example.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none transition-all"
                  style={{ borderColor: 'var(--echo-parchment-dark)', color: 'var(--echo-ink)' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--echo-ink)' }}>Tên</label>
                <input
                  type="text"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  placeholder="Tên admin"
                  className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none transition-all"
                  style={{ borderColor: 'var(--echo-parchment-dark)', color: 'var(--echo-ink)' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--echo-ink)' }}>Mật khẩu</label>
                <input
                  type="password"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  placeholder="Ít nhất 6 ký tự"
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none transition-all"
                  style={{ borderColor: 'var(--echo-parchment-dark)', color: 'var(--echo-ink)' }}
                />
              </div>

              {adminError && (
                <p className="text-sm" style={{ color: '#DC2626' }}>{adminError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateAdmin(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border-2 transition-all"
                  style={{ borderColor: 'var(--echo-parchment-dark)', color: 'var(--echo-ink)' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={creatingAdmin}
                  className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-all disabled:opacity-50"
                  style={{ backgroundColor: 'var(--echo-wood)', color: 'white' }}
                >
                  {creatingAdmin ? 'Đang tạo...' : 'Tạo Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
