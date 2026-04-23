import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Plus, Edit2, Trash2, MapPin, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ActionModal from '../components/ActionModal';

const NhaCungCapPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, MaNCC: '', TenNCC: '', DiaChi: '', SDT: '' });
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });
  
  const { user } = useAuth();
  const canEdit = user.VaiTro === 'ThuKho' || user.VaiTro === 'KeToan';

  const fetchData = async () => {
    try {
      const data = await axiosClient.get('/nhacungcap');
      setItems(data);
    } catch (err) {
      setError('Lỗi tải dữ liệu nhà cung cấp');
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
        await axiosClient.put(`/nhacungcap/${formData.id}`, formData);
      } else {
        await axiosClient.post('/nhacungcap', formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi lưu dữ liệu');
    }
  };

  const handleDelete = async () => {
    try {
      await axiosClient.delete(`/nhacungcap/${deleteModal.id}`);
      setDeleteModal({ show: false, id: null, name: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Lỗi xóa dữ liệu');
    }
  };

  const openAddModal = () => {
    setFormData({ id: null, MaNCC: '', TenNCC: '', DiaChi: '', SDT: '' });
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
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Quản lý Nhà Cung Cấp</h1>
        {canEdit && (
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} /> Thêm NCC
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {items.map((item) => (
          <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-info" style={{ marginBottom: '8px' }}>{item.MaNCC}</span>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{item.TenNCC}</h3>
              </div>
              {canEdit && (
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button className="btn btn-outline" style={{ padding: '6px', border: 'none' }} onClick={() => openEditModal(item)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="btn btn-outline" style={{ padding: '6px', border: 'none', color: 'var(--danger)' }} onClick={() => setDeleteModal({ show: true, id: item.id, name: item.TenNCC })}>
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{item.DiaChi || 'Chưa cập nhật'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} />
                <span>{item.SDT || 'Chưa cập nhật'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '16px' }}>{formData.id ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}</h2>
            
            {error && <div style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Mã NCC (vd: NCC006)*</label>
                <input className="form-control" value={formData.MaNCC} onChange={(e) => setFormData({...formData, MaNCC: e.target.value})} required disabled={!!formData.id} />
              </div>
              <div className="form-group">
                <label className="form-label">Tên NCC *</label>
                <input className="form-control" value={formData.TenNCC} onChange={(e) => setFormData({...formData, TenNCC: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Số điện thoại</label>
                <input className="form-control" value={formData.SDT} onChange={(e) => setFormData({...formData, SDT: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Địa chỉ</label>
                <input className="form-control" value={formData.DiaChi} onChange={(e) => setFormData({...formData, DiaChi: e.target.value})} />
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
        title="Xóa nhà cung cấp"
        message={`Bạn có chắc chắn muốn xóa "${deleteModal.name}"? Thao tác này không thể hoàn tác.`}
        type="danger"
        confirmText="Xóa"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ show: false, id: null, name: '' })}
      />
    </div>
  );
};

export default NhaCungCapPage;
