import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Package, ArrowDownToLine, ArrowUpFromLine, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import BarChartNhapXuat from '../components/charts/BarChartNhapXuat';
import PieChartHangHoa from '../components/charts/PieChartHangHoa';
import BarChartTop5Xuat from '../components/charts/BarChartTop5Xuat';

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
  const [chartNhapXuat, setChartNhapXuat] = useState([]);
  const [chartDvt, setChartDvt] = useState([]);
  const [chartTop5, setChartTop5] = useState([]);
  const [canhBao, setCanhBao] = useState({ count: 0, items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsData, nhapXuatData, dvtData, top5Data, canhBaoData] = await Promise.all([
          axiosClient.get('/baocao/dashboard-stats'),
          axiosClient.get('/baocao/chart-nhap-xuat-thang'),
          axiosClient.get('/baocao/chart-hang-theo-dvt'),
          axiosClient.get('/baocao/chart-top5-xuat'),
          axiosClient.get('/baocao/canh-bao-ton-kho'),
        ]);
        setStats(statsData);
        setChartNhapXuat(nhapXuatData);
        setChartDvt(dvtData);
        setChartTop5(top5Data);
        setCanhBao(canhBaoData);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (!stats) return <div>Lỗi tải dữ liệu.</div>;

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Tổng quan hệ thống</h1>
      
      {/* ===== Stat Cards ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <StatCard title="Tổng Hàng Hóa" value={stats.tongHangHoa} icon={Package} colorClass="badge-info" />
        <StatCard title="Phiếu nhập kho" value={stats.tongPhieuNhap} icon={ArrowDownToLine} colorClass="badge-success" />
        <StatCard title="Phiếu xuất kho" value={stats.tongPhieuXuat} icon={ArrowUpFromLine} colorClass="badge-warning" />
        <StatCard title="Cần tạo đơn nhập" value={stats.hangCanhBao} icon={AlertTriangle} colorClass="badge-danger" />
      </div>

      {/* ===== Charts Row: Bar + Pie ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '20px', marginBottom: '24px' }}>
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowDownToLine size={18} style={{ color: 'var(--accent-main)' }} /> Nhập / Xuất theo tháng
          </h3>
          <BarChartNhapXuat data={chartNhapXuat} />
        </div>
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={18} style={{ color: 'var(--accent-main)' }} /> Phân bổ theo ĐVT
          </h3>
          <PieChartHangHoa data={chartDvt} />
        </div>
      </div>

      {/* ===== Full-width: Top 5 Xuất ===== */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} style={{ color: 'var(--accent-main)' }} /> Top 5 hàng xuất nhiều nhất
        </h3>
        <BarChartTop5Xuat data={chartTop5} />
      </div>

      {/* ===== Bottom Row: Cảnh báo + Giao dịch gần đây ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Card cảnh báo tồn kho */}
        <div className="card" style={{ borderLeft: canhBao.count > 0 ? '4px solid var(--danger)' : '4px solid var(--success)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} style={{ color: canhBao.count > 0 ? 'var(--danger)' : 'var(--success)' }} />
            {canhBao.count > 0 ? `Cảnh báo tồn kho (${canhBao.count})` : 'Tồn kho ổn định ✓'}
          </h3>
          {canhBao.count > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '8px 0', fontWeight: '500', fontSize: '13px' }}>Mặt hàng</th>
                  <th style={{ padding: '8px 0', fontWeight: '500', fontSize: '13px', textAlign: 'right' }}>Tồn</th>
                  <th style={{ padding: '8px 0', fontWeight: '500', fontSize: '13px', textAlign: 'right' }}>Tối thiểu</th>
                  <th style={{ padding: '8px 0', fontWeight: '500', fontSize: '13px', textAlign: 'right' }}>Thiếu</th>
                </tr>
              </thead>
              <tbody>
                {canhBao.items.slice(0, 5).map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 0', fontWeight: '500', fontSize: '14px' }}>{item.TenHang}</td>
                    <td style={{ padding: '8px 0', textAlign: 'right' }}>
                      <span className="badge badge-danger">{item.SoLuongTonKho}</span>
                    </td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontSize: '14px' }}>{item.HanMucTonToiThieu}</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: '600', color: 'var(--danger)', fontSize: '14px' }}>-{item.ThieuHut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Tất cả hàng hóa đều đủ mức tồn kho tối thiểu.</p>
          )}
        </div>

        {/* Giao dịch gần đây */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} className="text-secondary" /> Giao dịch gần đây
          </h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '8px 0', fontWeight: '500', fontSize: '13px' }}>Mã Phiếu</th>
                <th style={{ padding: '8px 0', fontWeight: '500', fontSize: '13px' }}>Loại</th>
                <th style={{ padding: '8px 0', fontWeight: '500', fontSize: '13px' }}>Ngày</th>
                <th style={{ padding: '8px 0', fontWeight: '500', fontSize: '13px' }}>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {stats.phieuGanDay && stats.phieuGanDay.length > 0 ? stats.phieuGanDay.map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px 0', fontWeight: '500', fontSize: '14px' }}>{p.MaPhieu}</td>
                  <td style={{ padding: '8px 0', fontSize: '14px' }}>
                     {p.Loai === 'Nhap' ? 
                      <span style={{ color: 'var(--info)', display: 'flex', alignItems: 'center', gap:'4px' }}><ArrowDownToLine size={14}/> Nhập</span> : 
                      <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap:'4px' }}><ArrowUpFromLine size={14}/> Xuất</span>}
                  </td>
                  <td style={{ padding: '8px 0', fontSize: '14px' }}>{p.NgayLap}</td>
                  <td style={{ padding: '8px 0' }}>
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
