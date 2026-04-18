import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Plus, CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PhieuXuatPage = () => {
  const [phieuList, setPhieuList] = useState([]);
  const [hangHoaList, setHangHoaList] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  
  const [selectedPhieu, setSelectedPhieu] = useState(null);
  const [error, setError] = useState('');
  
  // Create form state
  const [formData, setFormData] = useState({
    MaPhieu: `PXK${Date.now().toString().slice(-6)}`,
    NgayLap: new Date().toISOString().split('T')[0],
    GhiChu: '',
    chiTiet: []
  });

  const { user } = useAuth();
  const canCreate = user.VaiTro === 'ThuKho';
  const canApprove = user.VaiTro === 'TruongKho';

  const fetchData = async () => {
    try {
      const [phieuData, hhData] = await Promise.all([
        axiosClient.get('/phieuxuat'),
        axiosClient.get('/hanghoa')
      ]);
      setPhieuList(phieuData);
      setHangHoaList(hhData);
    } catch (err) {
      setError('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openView = async (id) => {
    try {
      const data = await axiosClient.get(`/phieuxuat/${id}`);
      setSelectedPhieu(data);
      setViewModal(true);
    } catch (err) {
      alert('Lỗi tải chi tiết phiếu');
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Xác nhận duyệt phiếu xuất này? Tồn kho sẽ bị TRỪ TRỰC TIẾP.')) return;
    try {
      await axiosClient.put(`/phieuxuat/${id}/duyet`);
      setViewModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Lỗi duyệt phiếu');
    }
  };

  const handleReject = async (id) => {
    const lyDo = window.prompt('Nhập lý do từ chối:');
    if (lyDo === null) return;
    try {
      await axiosClient.put(`/phieuxuat/${id}/tuchoi`, { lyDo });
      setViewModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Lỗi từ chối phiếu');
    }
  };

  const addChiTietRow = () => {
    setFormData({
      ...formData,
      chiTiet: [...formData.chiTiet, { hang_hoa_id: '', SoLuong: 1, DonGia: 0 }]
    });
  };

  const updateChiTiet = (index, field, value) => {
    const newChiTiet = [...formData.chiTiet];
    newChiTiet[index][field] = value;
    setFormData({ ...formData, chiTiet: newChiTiet });
  };

  const removeChiTiet = (index) => {
    const newChiTiet = formData.chiTiet.filter((_, i) => i !== index);
    setFormData({ ...formData, chiTiet: newChiTiet });
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.chiTiet.length === 0) {
      return setError('Vui lòng thêm ít nhất 1 mặt hàng');
    }
    // Client-side quick stock check
    for (const ct of formData.chiTiet) {
       const h = hangHoaList.find(x => x.id === ct.hang_hoa_id);
       if (h && h.SoLuongTonKho < ct.SoLuong) {
         return setError(`Mặt hàng ${h.TenHang} không đủ tồn kho (chỉ còn ${h.SoLuongTonKho})`);
       }
    }

    try {
      await axiosClient.post('/phieuxuat', formData);
      setAddModal(false);
      setFormData({
        MaPhieu: `PXK${Date.now().toString().slice(-6)}`,
        NgayLap: new Date().toISOString().split('T')[0],
        GhiChu: '', chiTiet: []
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi tạo phiếu');
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Phiếu Xuất Kho</h1>
        {canCreate && (
          <button className="btn btn-primary" onClick={() => setAddModal(true)}>
            <Plus size={18} /> Lập phiếu mới
          </button>
        )}
      </div>

      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
              <th style={{ padding: '16px', fontWeight: '600' }}>Mã Phiếu</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Ngày Lập</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Người Lập</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Người Duyệt</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Trạng Thái</th>
              <th style={{ padding: '16px', fontWeight: '600', textAlign: 'right' }}>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {phieuList.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px', fontWeight: '500' }}>{p.MaPhieu}</td>
                <td style={{ padding: '16px' }}>{p.NgayLap}</td>
                <td style={{ padding: '16px' }}>{p.NguoiLap}</td>
                <td style={{ padding: '16px' }}>{p.NguoiDuyet || '-'}</td>
                <td style={{ padding: '16px' }}>
                  {p.TrangThai === 'DaDuyet' && <span className="badge badge-success">Đã duyệt</span>}
                  {p.TrangThai === 'ChoDuyet' && <span className="badge badge-warning">Chờ duyệt</span>}
                  {p.TrangThai === 'TuChoi' && <span className="badge badge-danger">Từ chối</span>}
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button className="btn btn-outline" style={{ padding: '6px' }} onClick={() => openView(p.id)}>
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Xem Phiếu */}
      {viewModal && selectedPhieu && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Chi tiết: {selectedPhieu.MaPhieu}</h2>
              <button className="btn btn-outline" style={{ padding: '4px' }} onClick={() => setViewModal(false)}>Đóng</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', fontSize: '14px' }}>
              <div><strong>Ngày lập:</strong> {selectedPhieu.NgayLap}</div>
              <div><strong>Trạng thái:</strong> {selectedPhieu.TrangThai}</div>
              <div><strong>Người lập:</strong> {selectedPhieu.NguoiLap} ({selectedPhieu.MaNVLap})</div>
              {selectedPhieu.NguoiDuyet && <div><strong>Người duyệt:</strong> {selectedPhieu.NguoiDuyet}</div>}
              {selectedPhieu.GhiChu && <div style={{ gridColumn: '1 / -1' }}><strong>Ghi chú:</strong> {selectedPhieu.GhiChu}</div>}
              {selectedPhieu.ly_do_tu_choi && <div style={{ gridColumn: '1 / -1', color: 'var(--danger)' }}><strong>Lý do từ chối:</strong> {selectedPhieu.ly_do_tu_choi}</div>}
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '24px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
                  <th style={{ padding: '12px' }}>Mặt hàng</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Số lượng</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Đơn giá xuất</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedPhieu.chiTiet.map((ct, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px' }}>{ct.TenHang} ({ct.DVT})</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{ct.SoLuong}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{ct.DonGia.toLocaleString()}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>{ct.ThanhTien.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Trưởng kho duyệt */}
            {canApprove && selectedPhieu.TrangThai === 'ChoDuyet' && (
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <button className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => handleReject(selectedPhieu.id)}>
                  <XCircle size={18} /> Từ chối
                </button>
                <button className="btn btn-primary" style={{ backgroundColor: 'var(--warning)', color: '#000' }} onClick={() => handleApprove(selectedPhieu.id)}>
                  <CheckCircle size={18} /> Duyệt & Xuất kho
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Lập Phiếu (ThuKho) */}
      {addModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '20px' }}>Lập Phiếu Xuất Kho</h2>
            {error && <div style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</div>}

            <form onSubmit={handleSubmitCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div className="form-group">
                  <label className="form-label">Mã phiếu</label>
                  <input className="form-control" value={formData.MaPhieu} onChange={e => setFormData({...formData, MaPhieu: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Ngày lập</label>
                  <input type="date" className="form-control" value={formData.NgayLap} onChange={e => setFormData({...formData, NgayLap: e.target.value})} required />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Ghi chú (Lý do xuất)</label>
                  <input className="form-control" value={formData.GhiChu} onChange={e => setFormData({...formData, GhiChu: e.target.value})} />
                </div>
              </div>

              {/* Chi Tiết */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '16px' }}>Chi tiết hàng xuất</h3>
                  <button type="button" className="btn btn-outline" onClick={addChiTietRow}><Plus size={16}/> Thêm dòng</button>
                </div>
                
                {formData.chiTiet.map((ct, index) => {
                   const hh = hangHoaList.find(h => h.id === ct.hang_hoa_id);
                   return (
                    <div key={index} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                      <select className="form-control" style={{ flex: 2 }} value={ct.hang_hoa_id} onChange={e => updateChiTiet(index, 'hang_hoa_id', parseInt(e.target.value))} required>
                        <option value="">-- Chọn mặt hàng --</option>
                        {hangHoaList.map(h => <option key={h.id} value={h.id}>{h.TenHang} (Tồn: {h.SoLuongTonKho} {h.DVT})</option>)}
                      </select>
                      <input type="number" className="form-control" style={{ flex: 1 }} placeholder={`SL (Tối đa ${hh?.SoLuongTonKho || 0})`} value={ct.SoLuong} onChange={e => updateChiTiet(index, 'SoLuong', parseInt(e.target.value))} required min="1" max={hh?.SoLuongTonKho || ''}/>
                      <input type="number" className="form-control" style={{ flex: 1 }} placeholder="Đơn giá" value={ct.DonGia} onChange={e => updateChiTiet(index, 'DonGia', parseFloat(e.target.value))} required min="0"/>
                      <button type="button" className="btn btn-outline" style={{ color: 'var(--danger)', padding: '8px' }} onClick={() => removeChiTiet(index)}><Trash2 size={16}/></button>
                    </div>
                  )
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setAddModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu phiếu xuất</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhieuXuatPage;
