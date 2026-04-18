import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { BrainCircuit, Play, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DuBaoPage = () => {
  const [history, setHistory] = useState([]);
  const [hangHoaList, setHangHoaList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedHangHoa, setSelectedHangHoa] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const { user } = useAuth();
  const canGenerate = user.VaiTro === 'TruongKho' || user.VaiTro === 'BanGD';

  const fetchData = async () => {
    try {
      const [histData, hhData] = await Promise.all([
        axiosClient.get('/dubao'),
        axiosClient.get('/hanghoa')
      ]);
      setHistory(histData);
      setHangHoaList(hhData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerate = async () => {
    if (!selectedHangHoa) return setError('Vui lòng chọn mặt hàng cần dự báo');
    
    setGenerating(true);
    setError('');
    setResult(null);
    
    try {
      setResult(data);
      fetchData(); // refresh history
    } catch (err) {
      console.log('[DuBaoPage] response error', err.response?.status, err.response?.data || err.message);
      setError(err.response?.data?.error || 'Lỗi sinh dự báo. Có thể Gemini API limit.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ 
          width: '48px', height: '48px', borderRadius: '12px', 
          backgroundColor: 'var(--accent-light)', color: 'var(--accent-main)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <BrainCircuit size={28} />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Dự Báo Nhu Cầu Tích Hợp AI</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Sử dụng Google Gemini Flash 3.0 phân tích lịch sử nhập/xuất để đề xuất kế hoạch nhập kho.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Module Dự Báo */}
        <div className="card">
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Thực hiện phân tích</h2>
          
          <div className="form-group">
            <label className="form-label">Chọn hàng hóa để phân tích</label>
            <select className="form-control" value={selectedHangHoa} onChange={e => setSelectedHangHoa(e.target.value)}>
              <option value="">-- Chọn mặt hàng --</option>
              {hangHoaList.map(h => (
                <option key={h.id} value={h.id}>{h.MaHang} - {h.TenHang}</option>
              ))}
            </select>
          </div>

          {error && <div style={{ color: 'var(--danger)', fontSize: '14px', marginBottom: '16px' }}>{error}</div>}

          {canGenerate ? (
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '12px', fontSize: '15px' }}
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? 'Đang phân tích dữ liệu...' : <><Play size={18} /> Chạy Mô Hình AI</>}
            </button>
          ) : (
            <p style={{ color: 'var(--warning)', fontSize: '13px' }}>Bạn không có quyền chạy mô hình AI.</p>
          )}

          {result && (
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--success)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--success)' }}>Kết quả phân tích</h3>
                <span className="badge badge-success">Độ tin cậy: {Math.round(result.DoChinhXac * 100)}%</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Mặt hàng:</span>
                  <span style={{ fontWeight: '500' }}>{result.hangHoa.TenHang}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Dự kiến XUẤT tháng tới:</span>
                  <span style={{ fontWeight: '600', fontSize: '16px' }}>{result.SoLuongDuBao}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Đề xuất NHẬP KHO bù:</span>
                  <span style={{ fontWeight: '600', fontSize: '16px', color: 'var(--danger)' }}>{result.deXuatNhap}</span>
                </div>
                <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#fff', borderRadius: '4px', fontSize: '13px', fontStyle: 'italic', borderLeft: '3px solid var(--accent-main)' }}>
                  {result.GhiChu}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lịch sử */}
        <div className="card" style={{ padding: '0' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={20} className="text-secondary" />
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Lịch sử chạy AI</h2>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
                <th style={{ padding: '12px 16px' }}>Ngày DB</th>
                <th style={{ padding: '12px 16px' }}>Mặt hàng</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Dự báo (Xuất)</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Độ Phù Hợp</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 16px' }}>{h.NgayDuBao}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '500' }}>{h.TenHang}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: 'var(--info)' }}>{h.SoLuongDuBao}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span className={`badge ${h.DoChinhXac >= 0.8 ? 'badge-success' : 'badge-warning'}`}>
                      {Math.round(h.DoChinhXac * 100)}%
                    </span>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr><td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Chưa có bản ghi dự báo nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DuBaoPage;
