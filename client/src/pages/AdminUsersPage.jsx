import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Plus, Edit2, Lock, Unlock, Search, Users } from 'lucide-react';
import Pagination from '../components/Pagination';
import ActionModal from '../components/ActionModal';

const ROLE_LABELS = {
  ThuKho: 'Thủ kho',
  TruongKho: 'Trưởng kho',
  KeToan: 'Kế toán kho',
  BoPhanYC: 'Bộ phận yêu cầu',
  BanGD: 'Ban Giám đốc',
  Admin: 'Quản trị viên',
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [statusModal, setStatusModal] = useState({ show: false, user: null, newStatus: '' });

  const [formData, setFormData] = useState({
    id: null,
    MaNV: '',
    HoTen: '',
    SDT: '',
    DiaChi: '',
    BoPhan: '',
    TenDangNhap: '',
    MatKhau: '',
    VaiTro: 'ThuKho',
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await axiosClient.get('/admin/users');
      setUsers(data);
    } catch (err) {
      setError('Lỗi khi tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredUsers = users.filter(u => {
    const term = searchTerm.toLowerCase();
    return (
      u.MaNV.toLowerCase().includes(term) ||
      u.HoTen.toLowerCase().includes(term) ||
      (u.TenDangNhap && u.TenDangNhap.toLowerCase().includes(term))
    );
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const openAddModal = () => {
    setFormData({
      id: null,
      MaNV: '',
      HoTen: '',
      SDT: '',
      DiaChi: '',
      BoPhan: '',
      TenDangNhap: '',
      MatKhau: '',
      VaiTro: 'ThuKho',
    });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setFormData({
      id: user.id,
      MaNV: user.MaNV,
      HoTen: user.HoTen,
      SDT: user.SDT || '',
      DiaChi: user.DiaChi || '',
      BoPhan: user.BoPhan,
      TenDangNhap: user.TenDangNhap || '',
      MatKhau: '',
      VaiTro: user.VaiTro || 'ThuKho',
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (formData.id) {
        await axiosClient.put(`/admin/users/${formData.id}`, formData);
      } else {
        await axiosClient.post('/admin/users', formData);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi lưu dữ liệu');
    }
  };

  const openStatusModal = (user) => {
    const newStatus = user.TrangThai === 'HoatDong' ? 'Khoa' : 'HoatDong';
    setStatusModal({ show: true, user, newStatus });
  };

  const handleToggleStatus = async () => {
    const { user, newStatus } = statusModal;
    try {
      await axiosClient.patch(`/admin/users/${user.tai_khoan_id}/status`, {
        TrangThai: newStatus,
      });
      setStatusModal({ show: false, user: null, newStatus: '' });
      fetchUsers();
    } catch (err) {
      setStatusModal({ show: false, user: null, newStatus: '' });
      alert(err.response?.data?.error || 'Lỗi cập nhật trạng thái');
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Quản trị Hệ thống</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Thêm tài khoản
        </button>
      </div>

      {/* Search */}
      <div className="card" style={{ padding: '20px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm theo mã NV, họ tên hoặc tên đăng nhập..."
            style={{ paddingLeft: '38px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          <Users size={16} />
          <span>{filteredUsers.length} tài khoản</span>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
              <th style={{ padding: '16px', fontWeight: '600' }}>Mã NV</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Họ Tên</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Bộ Phận</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Tên Đăng Nhập</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Vai Trò</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Trạng Thái</th>
              <th style={{ padding: '16px', fontWeight: '600', textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px', fontWeight: '500' }}>{u.MaNV}</td>
                <td style={{ padding: '16px', fontWeight: '500' }}>{u.HoTen}</td>
                <td style={{ padding: '16px' }}>{u.BoPhan}</td>
                <td style={{ padding: '16px' }}>{u.TenDangNhap || '—'}</td>
                <td style={{ padding: '16px' }}>
                  <span className="badge badge-info">{ROLE_LABELS[u.VaiTro] || u.VaiTro}</span>
                </td>
                <td style={{ padding: '16px' }}>
                  {u.TrangThai === 'HoatDong' ? (
                    <span className="badge badge-success">Hoạt động</span>
                  ) : u.TrangThai === 'Khoa' ? (
                    <span className="badge badge-danger">Đã khóa</span>
                  ) : (
                    <span className="badge" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>Chưa có TK</span>
                  )}
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button className="btn btn-outline" style={{ padding: '6px' }} title="Sửa" onClick={() => openEditModal(u)}>
                      <Edit2 size={16} />
                    </button>
                    {u.tai_khoan_id && (
                      <button
                        className="btn btn-outline"
                        style={{ padding: '6px', color: u.TrangThai === 'HoatDong' ? 'var(--danger)' : 'var(--success)' }}
                        title={u.TrangThai === 'HoatDong' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                        onClick={() => openStatusModal(u)}
                      >
                        {u.TrangThai === 'HoatDong' ? <Lock size={16} /> : <Unlock size={16} />}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {paginatedUsers.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>
                  Không tìm thấy nhân viên nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Form Modal — cùng pattern với NhaCungCapPage / HangHoaPage */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '540px' }}>
            <h2 style={{ marginBottom: '16px' }}>{formData.id ? 'Cập nhật nhân viên' : 'Tạo tài khoản mới'}</h2>

            {error && <div style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Mã NV *</label>
                  <input
                    className="form-control"
                    value={formData.MaNV}
                    onChange={(e) => setFormData({ ...formData, MaNV: e.target.value })}
                    required
                    disabled={!!formData.id}
                    placeholder="VD: NV010"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Bộ Phận *</label>
                  <input
                    className="form-control"
                    value={formData.BoPhan}
                    onChange={(e) => setFormData({ ...formData, BoPhan: e.target.value })}
                    required
                    placeholder="VD: Kho"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Họ và Tên *</label>
                <input
                  className="form-control"
                  value={formData.HoTen}
                  onChange={(e) => setFormData({ ...formData, HoTen: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Tên đăng nhập *</label>
                  <input
                    className="form-control"
                    value={formData.TenDangNhap}
                    onChange={(e) => setFormData({ ...formData, TenDangNhap: e.target.value })}
                    required
                    disabled={!!formData.id}
                    placeholder="VD: thukho3"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Vai trò *</label>
                  <select
                    className="form-control"
                    value={formData.VaiTro}
                    onChange={(e) => setFormData({ ...formData, VaiTro: e.target.value })}
                  >
                    <option value="ThuKho">Thủ kho</option>
                    <option value="TruongKho">Trưởng kho</option>
                    <option value="KeToan">Kế toán kho</option>
                    <option value="BoPhanYC">Bộ phận yêu cầu</option>
                    <option value="BanGD">Ban Giám đốc</option>
                    <option value="Admin">Quản trị viên (Admin)</option>
                  </select>
                </div>
              </div>
              {!formData.id && (
                <div className="form-group">
                  <label className="form-label">Mật khẩu *</label>
                  <input
                    className="form-control"
                    type="password"
                    value={formData.MatKhau}
                    onChange={(e) => setFormData({ ...formData, MatKhau: e.target.value })}
                    required
                    placeholder="Tối thiểu 6 ký tự"
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">{formData.id ? 'Cập nhật' : 'Tạo tài khoản'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal for Lock/Unlock */}
      <ActionModal
        isOpen={statusModal.show}
        title={statusModal.newStatus === 'Khoa' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
        message={statusModal.user
          ? statusModal.newStatus === 'Khoa'
            ? `Bạn có chắc muốn khóa tài khoản của "${statusModal.user.HoTen}"? Người dùng sẽ không thể đăng nhập cho đến khi được mở khóa.`
            : `Mở khóa tài khoản cho "${statusModal.user.HoTen}"? Người dùng sẽ có thể đăng nhập trở lại.`
          : ''}
        type={statusModal.newStatus === 'Khoa' ? 'danger' : 'success'}
        confirmText={statusModal.newStatus === 'Khoa' ? 'Khóa' : 'Mở khóa'}
        onConfirm={handleToggleStatus}
        onCancel={() => setStatusModal({ show: false, user: null, newStatus: '' })}
      />
    </div>
  );
};

export default AdminUsersPage;
