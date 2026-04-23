import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Plus, Eye, CheckCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ActionModal from '../components/ActionModal';

const KiemKePage = () => {
  const [phieuList, setPhieuList] = useState([]);
  const [hangHoaList, setHangHoaList] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  
  const [selectedPhieu, setSelectedPhieu] = useState(null);
  const [error, setError] = useState('');
  const [confirmModal, setConfirmModal] = useState({ show: false, id: null, capNhatTonKho: false });
  
  const [formData, setFormData] = useState({
    MaKiemKe: `PKK${Date.now().toString().slice(-6)}`,
    NgayKiem: new Date().toISOString().split('T')[0],
    GhiChu: '',
    chiTiet: []
  });

  const { user } = useAuth();
  const canEdit = user.VaiTro === 'ThuKho' || user.VaiTro === 'KeToan';

  const fetchData = async () => {
    try {
      const [phieuData, hhData] = await Promise.all([
        axiosClient.get('/kiemke'),
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
      const data = await axiosClient.get(`/kiemke/${id}`);
      setSelectedPhieu(data);
      setViewModal(true);
    } catch (err) {
      alert('Lỗi tải chi tiết phiếu kiếm kê');
    }
  };

  const handleComplete = async () => {
    try {
      await axiosClient.put(`/kiemke/${confirmModal.id}/hoanthanh`, { capNhatTonKho: confirmModal.capNhatTonKho });
      setConfirmModal({ show: false, id: null, capNhatTonKho: false });
      setViewModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Lỗi hoàn thành');
    }
  };

  const addChiTietRow = () => {
    setFormData({
      ...formData,
      chiTiet: [...formData.chiTiet, { hang_hoa_id: '', SoLuongThucTe: 0 }]
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
      return setError('Vui lòng thêm ít nhất 1 mặt hàng kiểm kê');
    }
    try {
      await axiosClient.post('/kiemke', formData);
      setAddModal(false);
      setFormData({
        MaKiemKe: `PKK${Date.now().toString().slice(-6)}`,
        NgayKiem: new Date().toISOString().split('T')[0],
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
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Phiếu Kiểm Kê</h1>
        {canEdit && (
          <button className="btn btn-primary" onClick={() => setAddModal(true)}>
            <Plus size={18} /> Lập phiếu kiểm kê
          </button>
        )}
      </div>

      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
              <th style={{ padding: '16px', fontWeight: '600' }}>Mã Kiểm Kê</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Ngày Kiểm</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Người Lập</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Trạng Thái</th>
              <th style={{ padding: '16px', fontWeight: '600', textAlign: 'right' }}>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {phieuList.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px', fontWeight: '500' }}>{p.MaKiemKe}</td>
                <td style={{ padding: '16px' }}>{p.NgayKiem}</td>
                <td style={{ padding: '16px' }}>{p.NguoiKiem}</td>
                <td style={{ padding: '16px' }}>
                  {p.TrangThai === 'HoanThanh' ? 
                    <span className="badge badge-success">Đã chốt</span> : 
                    <span className="badge badge-warning">Đang kiểm</span>
                  }
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

      {/* Modal Xem */}
      {viewModal && selectedPhieu && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Chi tiết đợt: {selectedPhieu.MaKiemKe}</h2>
              <button className="btn btn-outline" style={{ padding: '4px' }} onClick={() => setViewModal(false)}>Đóng</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', fontSize: '14px' }}>
              <div><strong>Ngày kiểm:</strong> {selectedPhieu.NgayKiem}</div>
              <div><strong>Trạng thái:</strong> {selectedPhieu.TrangThai}</div>
              {selectedPhieu.GhiChu && <div style={{ gridColumn: '1 / -1' }}><strong>Ghi chú:</strong> {selectedPhieu.GhiChu}</div>}
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '24px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
                  <th style={{ padding: '12px' }}>Mặt hàng</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Sổ sách</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Thực tế</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Chênh lệch</th>
                </tr>
              </thead>
              <tbody>
                {selectedPhieu.chiTiet.map((ct, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px' }}>{ct.TenHang}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{ct.SoLuongSoSach}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>{ct.SoLuongThucTe}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <span className={`badge ${ct.ChenhLech < 0 ? 'badge-danger' : ct.ChenhLech > 0 ? 'badge-warning' : 'badge-success'}`}>
                        {ct.ChenhLech > 0 ? '+' : ''}{ct.ChenhLech}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {canEdit && selectedPhieu.TrangThai !== 'HoanThanh' && (
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <button className="btn btn-outline" onClick={() => setConfirmModal({ show: true, id: selectedPhieu.id, capNhatTonKho: false })}>
                  Chốt (Không đổi kho)
                </button>
                <button className="btn btn-primary" onClick={() => setConfirmModal({ show: true, id: selectedPhieu.id, capNhatTonKho: true })}>
                  <CheckCircle size={18} /> Chốt & Cập nhật TonKho theo thực tế
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Lập (ThuKho/KeToan) */}
      {addModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '20px' }}>Lập Phiếu Kiểm Kê</h2>
            {error && <div style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</div>}

            <form onSubmit={handleSubmitCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div className="form-group">
                  <label className="form-label">Mã phiếu</label>
                  <input className="form-control" value={formData.MaKiemKe} onChange={e => setFormData({...formData, MaKiemKe: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Ngày kiểm</label>
                  <input type="date" className="form-control" value={formData.NgayKiem} onChange={e => setFormData({...formData, NgayKiem: e.target.value})} required />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Ghi chú</label>
                  <input className="form-control" value={formData.GhiChu} onChange={e => setFormData({...formData, GhiChu: e.target.value})} />
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '16px' }}>Ghi nhận thực tế</h3>
                  <button type="button" className="btn btn-outline" onClick={addChiTietRow}><Plus size={16}/> Thêm dòng</button>
                </div>
                
                {formData.chiTiet.map((ct, index) => {
                  const hh = hangHoaList.find(h => h.id === ct.hang_hoa_id);
                  return (
                    <div key={index} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                      <select className="form-control" style={{ flex: 2 }} value={ct.hang_hoa_id} onChange={e => updateChiTiet(index, 'hang_hoa_id', parseInt(e.target.value))} required>
                        <option value="">-- Chọn mặt hàng --</option>
                        {hangHoaList.map(h => <option key={h.id} value={h.id}>{h.TenHang} (Sổ sách: {h.SoLuongTonKho})</option>)}
                      </select>
                      <input type="number" className="form-control" style={{ flex: 1 }} placeholder="SL đếm tay thực tế" value={ct.SoLuongThucTe} onChange={e => updateChiTiet(index, 'SoLuongThucTe', parseInt(e.target.value))} required min="0"/>
                      <div style={{ width: '100px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Lệch: {hh ? ct.SoLuongThucTe - hh.SoLuongTonKho : 0}
                      </div>
                      <button type="button" className="btn btn-outline" style={{ color: 'var(--danger)', padding: '8px' }} onClick={() => removeChiTiet(index)}><Trash2 size={16}/></button>
                    </div>
                  )
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setAddModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu bản nháp</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ActionModal
        isOpen={confirmModal.show}
        title={confirmModal.capNhatTonKho ? 'Chốt & Cập nhật tồn kho' : 'Chốt kiểm kê'}
        message={confirmModal.capNhatTonKho
          ? 'Xác nhận cập nhật tồn kho bằng số lượng thực tế? Số lượng tồn kho trong hệ thống sẽ được ghi đè.'
          : 'Chỉ ghi nhận hoàn thành đợt kiểm kê, KHÔNG thay đổi số lượng tồn kho.'}
        type={confirmModal.capNhatTonKho ? 'warning' : 'success'}
        confirmText={confirmModal.capNhatTonKho ? 'Cập nhật tồn kho' : 'Chốt'}
        onConfirm={handleComplete}
        onCancel={() => setConfirmModal({ show: false, id: null, capNhatTonKho: false })}
      />
    </div>
  );
};

export default KiemKePage;
