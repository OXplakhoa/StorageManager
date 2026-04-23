import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { History, ArrowDownToLine, ArrowUpFromLine, ClipboardCheck, Filter } from 'lucide-react';

const LichSuTonKhoPage = () => {
  const [logs, setLogs] = useState([]);
  const [hangHoaList, setHangHoaList] = useState([]);
  const [filterHangHoa, setFilterHangHoa] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [hhData, logData] = await Promise.all([
        axiosClient.get('/hanghoa'),
        axiosClient.get(`/lichsu-tonkho${filterHangHoa ? `?hang_hoa_id=${filterHangHoa}` : ''}`),
      ]);
      setHangHoaList(hhData);
      setLogs(logData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filterHangHoa]);

  const loaiIcon = (loai) => {
    switch(loai) {
      case 'Nhap': return <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}><ArrowDownToLine size={14}/> Nhập</span>;
      case 'Xuat': return <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '4px' }}><ArrowUpFromLine size={14}/> Xuất</span>;
      case 'KiemKe': return <span style={{ color: 'var(--info)', display: 'flex', alignItems: 'center', gap: '4px' }}><ClipboardCheck size={14}/> Kiểm kê</span>;
      default: return <span style={{ color: 'var(--text-secondary)' }}>{loai}</span>;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <History size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Lịch Sử Biến Động Tồn Kho</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Sổ kho ghi lại mọi thay đổi số lượng tồn kho theo thời gian</p>
          </div>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="card" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Filter size={18} style={{ color: 'var(--text-secondary)' }} />
        <div className="form-group" style={{ marginBottom: 0, flex: 1, maxWidth: '400px' }}>
          <select className="form-control" value={filterHangHoa} onChange={e => setFilterHangHoa(e.target.value)}>
            <option value="">Tất cả mặt hàng</option>
            {hangHoaList.map(h => (
              <option key={h.id} value={h.id}>{h.MaHang} - {h.TenHang}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
                <th style={{ padding: '14px 16px', fontWeight: '600' }}>Thời gian</th>
                <th style={{ padding: '14px 16px', fontWeight: '600' }}>Mã Hàng</th>
                <th style={{ padding: '14px 16px', fontWeight: '600' }}>Tên Hàng</th>
                <th style={{ padding: '14px 16px', fontWeight: '600' }}>Loại</th>
                <th style={{ padding: '14px 16px', fontWeight: '600', textAlign: 'right' }}>Thay đổi</th>
                <th style={{ padding: '14px 16px', fontWeight: '600', textAlign: 'right' }}>Tồn sau</th>
                <th style={{ padding: '14px 16px', fontWeight: '600' }}>Chứng từ</th>
                <th style={{ padding: '14px 16px', fontWeight: '600' }}>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', whiteSpace: 'nowrap' }}>{log.NgayGhiNhan}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '500' }}>{log.MaHang}</td>
                  <td style={{ padding: '12px 16px' }}>{log.TenHang}</td>
                  <td style={{ padding: '12px 16px' }}>{loaiIcon(log.LoaiBienDong)}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600' }}>
                    <span style={{ color: log.SoLuongThayDoi > 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {log.SoLuongThayDoi > 0 ? '+' : ''}{log.SoLuongThayDoi}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600' }}>{log.TonKhoSau}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {log.MaChungTu && <span className="badge badge-info" style={{ fontSize: '12px' }}>{log.MaChungTu}</span>}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '200px' }}>{log.GhiChu}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Chưa có lịch sử biến động</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LichSuTonKhoPage;
