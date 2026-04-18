import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package } from 'lucide-react';

const LoginPage = () => {
  const [TenDangNhap, setTenDangNhap] = useState('');
  const [MatKhau, setMatKhau] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(TenDangNhap, MatKhau);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '48px', 
            height: '48px', 
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent-main)',
            borderRadius: '12px',
            marginBottom: '16px'
          }}>
            <Package size={24} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700' }}>HTTT Quản lý Kho</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            Đăng nhập để vào bảng điều khiển
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius)',
              marginBottom: '16px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Tên đăng nhập</label>
            <input 
              type="text" 
              className="form-control"
              value={TenDangNhap}
              onChange={(e) => setTenDangNhap(e.target.value)}
              placeholder="Nhập tên đăng nhập (vd: truongkho)"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input 
              type="password" 
              className="form-control"
              value={MatKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              placeholder="Nhập 123456"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
          <p>Tài khoản demo:</p>
          <p><strong>truongkho / thukho1 / ketoan</strong> (pass: 123456)</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
