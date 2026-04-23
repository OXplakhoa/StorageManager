import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { FileText, Plus, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DeNghiXuatPage = () => {
  const [list, setList] = useState([]);
  const [hangHoaList, setHangHoaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [rejectModal, setRejectModal] = useState({ show: false, id: null, lyDo: '' });
  const [taoPhieuModal, setTaoPhieuModal] = useState({ show: false, id: null, donGia: 0 });
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    MaDeNghi: `DNX${Date.now().toString().slice(-6)}`,
    NgayDeNghi: new Date().toISOString().split('T')[0],
    LyDo: '',
    hang_hoa_id: '',
    SoLuong: 1,
  });

  const { user } = useAuth();
  const isBoPhanYC = user.VaiTro === 'BoPhanYC';
  const isThuKho = user.VaiTro === 'ThuKho';

  const fetchData = async () => {
    try {
      const [dnData, hhData] = await Promise.all([
        axiosClient.get('/denghi'),
        axiosClient.get('/hanghoa'),
      ]);
      setList(dnData);
      setHangHoaList(hhData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axiosClient.post('/denghi', formData);
      setAddModal(false);
      setFormData({
        MaDeNghi: `DNX${Date.now().toString().slice(-6)}`,
        NgayDeNghi: new Date().toISOString().split('T')[0],
        LyDo: '', hang_hoa_id: '', SoLuong: 1,
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi tạo đề nghị');
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectModal.lyDo) return;
    try {
      await axiosClient.put(`/denghi/${rejectModal.id}/tuchoi`, { lyDo: rejectModal.lyDo });
      setRejectModal({ show: false, id: null, lyDo: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Lỗi từ chối');
    }
  };

  const handleTaoPhieuXuat = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post(`/denghi/${taoPhieuModal.id}/tao-phieu-xuat`, { DonGia: parseFloat(taoPhieuModal.donGia) || 0 });
      alert(res.message);
      setTaoPhieuModal({ show: false, id: null, donGia: 0 });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Lỗi tạo phiếu xuất');
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Phiếu Đề Nghị Xuất Kho</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Bộ phận yêu cầu lập → Thủ kho xét duyệt → Tạo phiếu xuất</p>
          </div>
        </div>
        {isBoPhanYC && (
          <button className="btn btn-primary" onClick={() => setAddModal(true)}>
            <Plus size={18} /> Lập đề nghị
          </button>
        )}
      </div>

      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
              <th style={{ padding: '16px', fontWeight: '600' }}>Mã ĐN</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Ngày</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Người ĐN</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Mặt hàng</th>
              <th style={{ padding: '16px', fontWeight: '600', textAlign: 'right' }}>SL</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Lý do</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Trạng thái</th>
              {isThuKho && <th style={{ padding: '16px', fontWeight: '600', textAlign: 'right' }}>Xử lý</th>}
            </tr>
          </thead>
          <tbody>
            {list.map((dn) => (
              <tr key={dn.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px', fontWeight: '500' }}>{dn.MaDeNghi}</td>
                <td style={{ padding: '16px' }}>{dn.NgayDeNghi}</td>
                <td style={{ padding: '16px' }}>{dn.NguoiDeNghi} ({dn.BoPhan})</td>
                <td style={{ padding: '16px' }}>{dn.TenHang} ({dn.DVT})</td>
                <td style={{ padding: '16px', textAlign: 'right', fontWeight: '600' }}>{dn.SoLuong}</td>
                <td style={{ padding: '16px', fontSize: '13px', maxWidth: '200px' }}>{dn.LyDo}</td>
                <td style={{ padding: '16px' }}>
                  {dn.TrangThai === 'ChoXuLy' && <span className="badge badge-warning">Chờ xử lý</span>}
                  {dn.TrangThai === 'DaTaoPhieu' && <span className="badge badge-success">Đã tạo phiếu</span>}
                  {dn.TrangThai === 'TuChoi' && <span className="badge badge-danger">Từ chối</span>}
                </td>
                {isThuKho && (
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    {dn.TrangThai === 'ChoXuLy' && (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn btn-outline" style={{ padding: '6px 10px', fontSize: '13px', color: 'var(--danger)' }} onClick={() => setRejectModal({ show: true, id: dn.id, lyDo: '' })}>
                          <XCircle size={14} /> Từ chối
                        </button>
                        <button className="btn btn-primary" style={{ padding: '6px 10px', fontSize: '13px', backgroundColor: 'var(--success)' }} onClick={() => setTaoPhieuModal({ show: true, id: dn.id, donGia: 0 })}>
                          <ArrowRight size={14} /> Tạo PXK
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan="8" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Chưa có phiếu đề nghị nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal tạo đề nghị */}
      {addModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '16px' }}>Lập Phiếu Đề Nghị Xuất Kho</h2>
            {error && <div style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</div>}
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Mã đề nghị</label>
                <input className="form-control" value={formData.MaDeNghi} onChange={e => setFormData({...formData, MaDeNghi: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Mặt hàng cần xuất *</label>
                <select className="form-control" value={formData.hang_hoa_id} onChange={e => setFormData({...formData, hang_hoa_id: parseInt(e.target.value)})} required>
                  <option value="">-- Chọn mặt hàng --</option>
                  {hangHoaList.map(h => <option key={h.id} value={h.id}>{h.MaHang} - {h.TenHang} (Tồn: {h.SoLuongTonKho})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Số lượng *</label>
                <input type="number" className="form-control" min="1" value={formData.SoLuong} onChange={e => setFormData({...formData, SoLuong: parseInt(e.target.value)})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Lý do đề nghị *</label>
                <textarea className="form-control" rows="3" value={formData.LyDo} onChange={e => setFormData({...formData, LyDo: e.target.value})} required placeholder="Ví dụ: Cần vật tư cho công trình C..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setAddModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Gửi đề nghị</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal từ chối đề nghị */}
      {rejectModal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ marginBottom: '16px', color: 'var(--danger)', fontSize: '20px' }}>Từ chối đề nghị</h2>
            <form onSubmit={handleReject}>
              <div className="form-group">
                <label className="form-label">Lý do từ chối *</label>
                <textarea className="form-control" rows="3" value={rejectModal.lyDo} onChange={e => setRejectModal({...rejectModal, lyDo: e.target.value})} required autoFocus placeholder="Nhập lý do từ chối..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setRejectModal({ show: false, id: null, lyDo: '' })}>Hủy</button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }}>Xác nhận từ chối</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal tạo phiếu xuất */}
      {taoPhieuModal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ marginBottom: '16px', color: 'var(--success)', fontSize: '20px' }}>Tạo phiếu xuất kho</h2>
            <form onSubmit={handleTaoPhieuXuat}>
              <div className="form-group">
                <label className="form-label">Đơn giá xuất (VNĐ)</label>
                <input type="number" min="0" className="form-control" value={taoPhieuModal.donGia} onChange={e => setTaoPhieuModal({...taoPhieuModal, donGia: e.target.value})} autoFocus placeholder="0" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setTaoPhieuModal({ show: false, id: null, donGia: 0 })}>Hủy</button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--success)', borderColor: 'var(--success)' }}>Tạo Phiếu Xuất</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeNghiXuatPage;
