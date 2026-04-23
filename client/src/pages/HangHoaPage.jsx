import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ActionModal from '../components/ActionModal';

const HangHoaPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, MaHang: '', TenHang: '', DVT: '', SoLuongTonKho: 0, HanMucTonToiThieu: 10 });
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });
  
  const { user } = useAuth();
  const canEdit = user.VaiTro === 'ThuKho' || user.VaiTro === 'KeToan';

  const fetchData = async () => {
    try {
      const data = await axiosClient.get('/hanghoa');
      setItems(data);
    } catch (err) {
      setError('Lỗi tải dữ liệu hàng hóa');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (formData.id) {
        await axiosClient.put(`/hanghoa/${formData.id}`, formData);
      } else {
        await axiosClient.post('/hanghoa', formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi lưu dữ liệu');
    }
  };

  const handleDelete = async () => {
    try {
      await axiosClient.delete(`/hanghoa/${deleteModal.id}`);
      setDeleteModal({ show: false, id: null, name: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Lỗi xóa dữ liệu');
    }
  };

  const openAddModal = () => {
    setFormData({ id: null, MaHang: '', TenHang: '', DVT: '', SoLuongTonKho: 0, HanMucTonToiThieu: 10 });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setFormData(item);
    setError('');
    setShowModal(true);
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Quản lý Hàng Hóa</h1>
        {canEdit && (
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} /> Thêm mới
          </button>
        )}
      </div>

      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
              <th style={{ padding: '16px', fontWeight: '600' }}>Mã Hàng</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Tên Hàng</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>ĐVT</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Tồn Kho</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Mức Tối Thiểu</th>
              {canEdit && <th style={{ padding: '16px', fontWeight: '600', textAlign: 'right' }}>Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isLowStock = item.SoLuongTonKho < item.HanMucTonToiThieu;
              return (
                <tr key={item.id} style={{ 
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: isLowStock ? 'rgba(239, 68, 68, 0.06)' : 'transparent',
                }}>
                  <td style={{ padding: '16px' }}>{item.MaHang}</td>
                  <td style={{ padding: '16px', fontWeight: '500' }}>
                    {isLowStock && <AlertTriangle size={14} style={{ color: 'var(--danger)', marginRight: '6px', verticalAlign: 'middle' }} />}
                    {item.TenHang}
                  </td>
                  <td style={{ padding: '16px' }}>{item.DVT}</td>
                  <td style={{ padding: '16px' }}>
                    <span className={`badge ${isLowStock ? 'badge-danger' : 'badge-success'}`}>
                      {item.SoLuongTonKho}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>{item.HanMucTonToiThieu}</td>
                  {canEdit && (
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button className="btn btn-outline" style={{ padding: '6px' }} onClick={() => openEditModal(item)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-outline" style={{ padding: '6px', color: 'var(--danger)' }} onClick={() => setDeleteModal({ show: true, id: item.id, name: item.TenHang })}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '16px' }}>{formData.id ? 'Sửa hàng hóa' : 'Thêm hàng hóa mới'}</h2>
            
            {error && <div style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Mã Hàng (vd: HH016)*</label>
                <input className="form-control" value={formData.MaHang} onChange={(e) => setFormData({...formData, MaHang: e.target.value})} required disabled={!!formData.id} />
              </div>
              <div className="form-group">
                <label className="form-label">Tên Hàng *</label>
                <input className="form-control" value={formData.TenHang} onChange={(e) => setFormData({...formData, TenHang: e.target.value})} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Đơn Vị Tính *</label>
                  <input className="form-control" value={formData.DVT} onChange={(e) => setFormData({...formData, DVT: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Tồn Kho Bắt Đầu</label>
                  <input className="form-control" type="number" min="0" value={formData.SoLuongTonKho} onChange={(e) => setFormData({...formData, SoLuongTonKho: parseInt(e.target.value)})} disabled={!!formData.id} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Hạn Mức Tối Thiểu</label>
                <input className="form-control" type="number" min="0" value={formData.HanMucTonToiThieu} onChange={(e) => setFormData({...formData, HanMucTonToiThieu: parseInt(e.target.value)})} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">{formData.id ? 'Cập nhật' : 'Thêm mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ActionModal
        isOpen={deleteModal.show}
        title="Xóa mặt hàng"
        message={`Bạn có chắc chắn muốn xóa "${deleteModal.name}"? Thao tác này không thể hoàn tác.`}
        type="danger"
        confirmText="Xóa"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ show: false, id: null, name: '' })}
      />
    </div>
  );
};

export default HangHoaPage;
