import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Lock, CheckCircle } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    matKhauCu: '',
    matKhauMoi: '',
    xacNhanMatKhau: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getRoleBadge = (role) => {
    switch(role) {
      case 'TruongKho': return <span className="badge badge-danger">Trưởng Kho</span>;
      case 'ThuKho': return <span className="badge badge-warning">Thủ Kho</span>;
      case 'KeToan': return <span className="badge badge-info">Kế Toán</span>;
      case 'BanGD': return <span className="badge badge-success">Ban Giám Đốc</span>;
      case 'BoPhanYC': return <span className="badge badge-info">Bộ Phận Yêu Cầu</span>;
      default: return <span className="badge badge-info">{role}</span>;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.matKhauMoi.length < 6) {
      return setError('Mật khẩu mới phải có tối thiểu 6 ký tự.');
    }

    if (formData.matKhauMoi === formData.matKhauCu) {
      return setError('Mật khẩu mới phải khác mật khẩu cũ.');
    }

    if (formData.matKhauMoi !== formData.xacNhanMatKhau) {
      return setError('Xác nhận mật khẩu không khớp.');
    }

    setLoading(true);
    try {
      await axiosClient.put('/auth/doi-mat-khau', {
        matKhauCu: formData.matKhauCu,
        matKhauMoi: formData.matKhauMoi
      });
      setSuccess('Đổi mật khẩu thành công!');
      setFormData({ matKhauCu: '', matKhauMoi: '', xacNhanMatKhau: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700' }}>Hồ sơ cá nhân</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Quản lý thông tin và bảo mật tài khoản</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Thông tin nhân viên */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <Shield size={20} style={{ color: 'var(--accent-main)' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Thông tin nhân viên</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Mã Nhân Viên</span>
              <span style={{ fontWeight: '500' }}>{user.MaNV}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Họ và Tên</span>
              <span style={{ fontWeight: '600', fontSize: '16px' }}>{user.HoTen}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tên đăng nhập</span>
              <span style={{ fontWeight: '500' }}>{user.TenDangNhap}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Phòng ban</span>
              <span style={{ fontWeight: '500' }}>{user.BoPhan}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Vai trò hệ thống</span>
              {getRoleBadge(user.VaiTro)}
            </div>
          </div>
        </div>

        {/* Đổi mật khẩu */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <Lock size={20} style={{ color: 'var(--warning)' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Đổi mật khẩu</h2>
          </div>

          {error && <div style={{ color: 'var(--danger)', marginBottom: '16px', fontSize: '14px', backgroundColor: 'var(--danger-bg)', padding: '12px', borderRadius: '6px' }}>{error}</div>}
          {success && <div style={{ color: 'var(--success)', marginBottom: '16px', fontSize: '14px', backgroundColor: 'var(--success-bg)', padding: '12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16}/> {success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Mật khẩu hiện tại *</label>
              <input 
                type="password" 
                className="form-control" 
                value={formData.matKhauCu}
                onChange={(e) => setFormData({...formData, matKhauCu: e.target.value})}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mật khẩu mới (tối thiểu 6 ký tự) *</label>
              <input 
                type="password" 
                className="form-control" 
                value={formData.matKhauMoi}
                onChange={(e) => setFormData({...formData, matKhauMoi: e.target.value})}
                required 
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Xác nhận mật khẩu mới *</label>
              <input 
                type="password" 
                className="form-control" 
                value={formData.xacNhanMatKhau}
                onChange={(e) => setFormData({...formData, xacNhanMatKhau: e.target.value})}
                required 
                minLength="6"
              />
            </div>
            
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '140px' }}>
                {loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
