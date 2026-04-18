import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Download, AlertTriangle, ArrowDownUp } from 'lucide-react';

const BaoCaoPage = () => {
  const [activeTab, setActiveTab] = useState('nxt'); // nxt, canhbao
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [dateRange, setDateRange] = useState({
    tuNgay: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    denNgay: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'nxt') {
        const res = await axiosClient.get(`/baocao/nhap-xuat-ton?tuNgay=${dateRange.tuNgay}&denNgay=${dateRange.denNgay}`);
        setData(res);
      } else {
        const res = await axiosClient.get('/baocao/duoi-muc-toi-thieu');
        setData(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Báo cáo, thống kê</h1>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button 
              className={`btn ${activeTab === 'nxt' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('nxt')}
            >
              <ArrowDownUp size={16} /> Nhập - Xuất - Tồn
            </button>
            <button 
              className={`btn ${activeTab === 'canhbao' ? 'btn-primary' : 'btn-outline'}`}
              style={activeTab === 'canhbao' ? { backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' } : {}}
              onClick={() => setActiveTab('canhbao')}
            >
              <AlertTriangle size={16} /> Báo động tồn kho
            </button>
          </div>
        </div>
        <button className="btn btn-outline" style={{ color: 'var(--text-secondary)' }}>
          <Download size={18} /> Xuất PDF
        </button>
      </div>

      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        
        {activeTab === 'nxt' && (
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '16px', alignItems: 'flex-end', backgroundColor: 'var(--bg-primary)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Từ ngày</label>
              <input type="date" className="form-control" value={dateRange.tuNgay} onChange={e => setDateRange({...dateRange, tuNgay: e.target.value})} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Đến ngày</label>
              <input type="date" className="form-control" value={dateRange.denNgay} onChange={e => setDateRange({...dateRange, denNgay: e.target.value})} />
            </div>
            <button className="btn btn-primary" onClick={fetchData} disabled={loading}>Lọc kết quả</button>
          </div>
        )}

        <div style={{ padding: '16px' }}>
          {loading ? (
            <div>Đang tính toán dữ liệu...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 8px' }}>Mã Hàng</th>
                  <th style={{ padding: '12px 8px' }}>Tên Hàng</th>
                  <th style={{ padding: '12px 8px' }}>ĐVT</th>
                  
                  {activeTab === 'nxt' ? (
                    <>
                      <th style={{ padding: '12px 8px', textAlign: 'right' }}>Tổng Nhập</th>
                      <th style={{ padding: '12px 8px', textAlign: 'right' }}>Tổng Xuất</th>
                      <th style={{ padding: '12px 8px', textAlign: 'right' }}>Tồn Cuối Kỳ</th>
                    </>
                  ) : (
                    <>
                      <th style={{ padding: '12px 8px', textAlign: 'right' }}>Tồn Hiện Tại</th>
                      <th style={{ padding: '12px 8px', textAlign: 'right' }}>Mức Tối Thiểu</th>
                      <th style={{ padding: '12px 8px', textAlign: 'right' }}>Cần Nhập Thêm</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 8px' }}>{item.MaHang}</td>
                    <td style={{ padding: '12px 8px', fontWeight: '500' }}>{item.TenHang}</td>
                    <td style={{ padding: '12px 8px' }}>{item.DVT}</td>
                    
                    {activeTab === 'nxt' ? (
                      <>
                        <td style={{ padding: '12px 8px', textAlign: 'right', color: 'var(--success)' }}>+{item.tongNhap}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'right', color: 'var(--warning)' }}>-{item.tongXuat}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>{item.SoLuongTonKho}</td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '12px 8px', textAlign: 'right', color: 'var(--danger)', fontWeight: '600' }}>{item.SoLuongTonKho}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'right' }}>{item.HanMucTonToiThieu}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                          <span className="badge badge-danger">+{item.ThieuHut}</span>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Không có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default BaoCaoPage;
