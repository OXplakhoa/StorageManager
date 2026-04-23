import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleColors = {
    TruongKho: 'badge-danger',
    ThuKho: 'badge-info',
    KeToan: 'badge-warning',
    BanGD: 'badge-success'
  };

  return (
    <header className="header">
      <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
        Hệ thống Quản lý Kho
      </h2>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>{user.HoTen}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
               Hỗ trợ: {user.BoPhan}
            </div>
          </div>
          <span className={`badge ${roleColors[user.VaiTro] || 'badge-info'}`}>
            {user.VaiTro}
          </span>
        </div>
        
        <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border-color)' }}></div>
        
        <button 
          onClick={() => navigate('/profile')}
          className="btn btn-outline" 
          style={{ padding: '8px', border: 'none', color: 'var(--text-secondary)' }}
          title="Trang cá nhân"
        >
          <User size={18} />
        </button>

        <button 
          onClick={handleLogout}
          className="btn btn-outline" 
          style={{ padding: '8px', border: 'none', color: 'var(--danger)' }}
          title="Đăng xuất"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
