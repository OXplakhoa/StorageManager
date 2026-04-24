const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const getDb = require('../database/db');
const { authenticate, requireRole } = require('../middleware/auth');

// Middleware to ensure user is Admin
router.use(authenticate, requireRole('Admin'));

// Lấy danh sách nhân viên (kèm tài khoản)
router.get('/users', (req, res) => {
  const db = getDb();
  const users = db.prepare(`
    SELECT nv.*, tk.id as tai_khoan_id, tk.TenDangNhap, tk.VaiTro, tk.TrangThai 
    FROM NhanVien nv
    LEFT JOIN TaiKhoan tk ON nv.id = tk.nhan_vien_id
    ORDER BY nv.id DESC
  `).all();
  res.json(users);
});

// Thêm nhân viên & tài khoản mới
router.post('/users', (req, res) => {
  const { MaNV, HoTen, SDT, DiaChi, NgaySinh, BoPhan, TenDangNhap, MatKhau, VaiTro } = req.body;
  if (!MaNV || !HoTen || !BoPhan || !TenDangNhap || !MatKhau || !VaiTro) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
  }

  const db = getDb();
  
  // Check if MaNV or TenDangNhap exists
  const existingNV = db.prepare('SELECT id FROM NhanVien WHERE MaNV = ?').get(MaNV);
  if (existingNV) return res.status(400).json({ error: 'Mã nhân viên đã tồn tại' });
  
  const existingTK = db.prepare('SELECT id FROM TaiKhoan WHERE TenDangNhap = ?').get(TenDangNhap);
  if (existingTK) return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(MatKhau, salt);

  const insertNV = db.prepare('INSERT INTO NhanVien (MaNV, HoTen, SDT, DiaChi, NgaySinh, BoPhan) VALUES (?, ?, ?, ?, ?, ?)');
  const insertTK = db.prepare('INSERT INTO TaiKhoan (TenDangNhap, MatKhau, VaiTro, TrangThai, nhan_vien_id) VALUES (?, ?, ?, ?, ?)');
  
  try {
    const runTransaction = db.transaction(() => {
      const infoNV = insertNV.run(MaNV, HoTen, SDT || '', DiaChi || '', NgaySinh || null, BoPhan);
      const nvId = infoNV.lastInsertRowid;
      insertTK.run(TenDangNhap, hashedPassword, VaiTro, 'HoatDong', nvId);
      return nvId;
    });
    
    const newId = runTransaction();
    res.json({ message: 'Tạo tài khoản thành công', id: newId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi khi tạo tài khoản' });
  }
});

// Cập nhật thông tin cơ bản nhân viên (Chỉ sửa NhanVien, Role)
router.put('/users/:id', (req, res) => {
  const { HoTen, SDT, DiaChi, NgaySinh, BoPhan, VaiTro } = req.body;
  const { id } = req.params; // NhanVien ID
  
  const db = getDb();
  
  try {
    const runTransaction = db.transaction(() => {
      db.prepare('UPDATE NhanVien SET HoTen = ?, SDT = ?, DiaChi = ?, NgaySinh = ?, BoPhan = ? WHERE id = ?')
        .run(HoTen, SDT || '', DiaChi || '', NgaySinh || null, BoPhan, id);
      db.prepare('UPDATE TaiKhoan SET VaiTro = ? WHERE nhan_vien_id = ?')
        .run(VaiTro, id);
    });
    runTransaction();
    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi cập nhật thông tin' });
  }
});

// Khóa/Mở khóa tài khoản
router.patch('/users/:id/status', (req, res) => {
  const { TrangThai } = req.body; // 'HoatDong' or 'Khoa'
  const { id } = req.params; // TaiKhoan ID
  
  if (TrangThai !== 'HoatDong' && TrangThai !== 'Khoa') {
    return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
  }
  
  const db = getDb();
  try {
    const targetTK = db.prepare('SELECT id, TenDangNhap FROM TaiKhoan WHERE id = ?').get(id);
    if (targetTK && targetTK.TenDangNhap === req.user.TenDangNhap) {
      return res.status(400).json({error: "Không thể tự khoá tài khoản của chính mình"});
    }
    
    db.prepare('UPDATE TaiKhoan SET TrangThai = ? WHERE id = ?').run(TrangThai, id);
    res.json({ message: 'Cập nhật trạng thái thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi cập nhật trạng thái' });
  }
});

module.exports = router;
