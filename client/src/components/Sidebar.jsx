import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ClipboardCheck, 
  BarChart3, 
  BrainCircuit
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.VaiTro;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['ThuKho', 'TruongKho', 'KeToan', 'BanGD'] },
    { name: 'Khách hàng / NCC', path: '/nhacungcap', icon: Truck, roles: ['ThuKho', 'KeToan'] },
    { name: 'Hàng hóa', path: '/hanghoa', icon: Package, roles: ['ThuKho', 'KeToan'] },
    { name: 'Nhập kho', path: '/nhapkho', icon: ArrowDownToLine, roles: ['ThuKho', 'TruongKho'] },
    { name: 'Xuất kho', path: '/xuatkho', icon: ArrowUpFromLine, roles: ['ThuKho', 'TruongKho'] },
    { name: 'Kiểm kê', path: '/kiemke', icon: ClipboardCheck, roles: ['ThuKho', 'KeToan', 'TruongKho'] },
    { name: 'Báo cáo', path: '/baocao', icon: BarChart3, roles: ['KeToan', 'TruongKho', 'BanGD'] },
    { name: 'Dự báo AI', path: '/dubao', icon: BrainCircuit, roles: ['TruongKho', 'BanGD'] },
  ];

  const visibleItems = navItems.filter(item => item.roles.includes(role));

  return (
    <aside className="sidebar">
      <div style={{ 
        padding: '0 24px', 
        fontSize: '20px', 
        fontWeight: '700', 
        color: 'var(--accent-main)', 
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Package size={24} />
        WMS Admin
      </div>
      
      <div style={{ padding: '0 16px', marginBottom: '16px' }}>
        <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Menu chính</p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px' }}>
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `btn btn-outline ${isActive ? 'active' : ''}`
              }
              style={({ isActive }) => ({
                justifyContent: 'flex-start',
                border: 'none',
                backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                color: isActive ? 'var(--accent-main)' : 'var(--text-primary)',
                fontWeight: isActive ? '600' : '500'
              })}
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
