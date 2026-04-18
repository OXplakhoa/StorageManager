import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Package, ArrowDownToLine, ArrowUpFromLine, AlertTriangle, Clock } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
    <div className={colorClass} style={{ 
      width: '48px', height: '48px', borderRadius: '12px', 
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <Icon size={24} />
    </div>
    <div>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>{title}</p>
      <h3 style={{ fontSize: '24px', fontWeight: '700', marginTop: '4px' }}>{value}</h3>
    </div>
  </div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await axiosClient.get('/baocao/dashboard-stats');
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (!stats) return <div>Lỗi tải dữ liệu.</div>;

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Tổng quan hệ thống</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <StatCard 
          title="Tổng Hàng Hóa" 
          value={stats.tongHangHoa} 
          icon={Package} 
          colorClass="badge-info"
        />
        <StatCard 
          title="Phiếu nhập kho" 
          value={stats.tongPhieuNhap} 
          icon={ArrowDownToLine} 
          colorClass="badge-success"
        />
        <StatCard 
          title="Phiếu xuất kho" 
          value={stats.tongPhieuXuat} 
          icon={ArrowUpFromLine} 
          colorClass="badge-warning"
        />
        <StatCard 
          title="Cần tạo đơn nhập" 
          value={stats.hangCanhBao} 
          icon={AlertTriangle} 
          colorClass="badge-danger"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} className="text-secondary" /> Giao dịch gần đây
          </h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 0', fontWeight: '500' }}>Mã Phiếu</th>
                <th style={{ padding: '12px 0', fontWeight: '500' }}>Loại</th>
                <th style={{ padding: '12px 0', fontWeight: '500' }}>Ngày Lập</th>
                <th style={{ padding: '12px 0', fontWeight: '500' }}>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {stats.phieuGanDay && stats.phieuGanDay.length > 0 ? stats.phieuGanDay.map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 0', fontWeight: '500' }}>{p.MaPhieu}</td>
                  <td style={{ padding: '12px 0' }}>
                     {p.Loai === 'Nhap' ? 
                      <span style={{ color: 'var(--info)', display: 'flex', alignItems: 'center', gap:'4px' }}><ArrowDownToLine size={14}/> Nhập kho</span> : 
                      <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap:'4px' }}><ArrowUpFromLine size={14}/> Xuất kho</span>}
                  </td>
                  <td style={{ padding: '12px 0' }}>{p.NgayLap}</td>
                  <td style={{ padding: '12px 0' }}>
                    {p.TrangThai === 'DaDuyet' && <span className="badge badge-success">Đã duyệt</span>}
                    {p.TrangThai === 'ChoDuyet' && <span className="badge badge-warning">Chờ duyệt</span>}
                    {p.TrangThai === 'TuChoi' && <span className="badge badge-danger">Từ chối</span>}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" style={{ padding: '12px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
