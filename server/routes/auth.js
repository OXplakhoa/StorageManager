const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getDb = require('../database/db');
const { authenticate, JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { TenDangNhap, MatKhau } = req.body;

  if (!TenDangNhap || !MatKhau) {
    return res.status(400).json({ error: 'Vui lòng nhập tên đăng nhập và mật khẩu' });
  }

  const db = getDb();
  const account = db.prepare(`
    SELECT tk.*, nv.HoTen, nv.MaNV, nv.BoPhan
    FROM TaiKhoan tk
    JOIN NhanVien nv ON tk.nhan_vien_id = nv.id
    WHERE tk.TenDangNhap = ?
  `).get(TenDangNhap);

  if (!account) {
    return res.status(401).json({ error: 'Tên đăng nhập không tồn tại' });
  }

  if (account.TrangThai === 'Khoa') {
    return res.status(403).json({ error: 'Tài khoản đã bị khóa' });
  }

  const validPassword = bcrypt.compareSync(MatKhau, account.MatKhau);
  if (!validPassword) {
    return res.status(401).json({ error: 'Mật khẩu không đúng' });
  }

  // Generate JWT
  const token = jwt.sign(
    {
      id: account.id,
      nhan_vien_id: account.nhan_vien_id,
      TenDangNhap: account.TenDangNhap,
      VaiTro: account.VaiTro,
      HoTen: account.HoTen,
      MaNV: account.MaNV,
      BoPhan: account.BoPhan,
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({
    token,
    user: {
      id: account.id,
      nhan_vien_id: account.nhan_vien_id,
      TenDangNhap: account.TenDangNhap,
      VaiTro: account.VaiTro,
      HoTen: account.HoTen,
      MaNV: account.MaNV,
      BoPhan: account.BoPhan,
    },
  });
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// PUT /api/auth/doi-mat-khau
router.put('/doi-mat-khau', authenticate, (req, res) => {
  const { matKhauCu, matKhauMoi } = req.body;

  if (!matKhauCu || !matKhauMoi) {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' });
  }

  if (matKhauMoi.length < 6) {
    return res.status(400).json({ error: 'Mật khẩu tối thiểu 6 ký tự' });
  }

  if (matKhauMoi === matKhauCu) {
    return res.status(400).json({ error: 'Mật khẩu mới phải khác mật khẩu cũ' });
  }

  const db = getDb();
  const account = db.prepare('SELECT * FROM TaiKhoan WHERE id = ?').get(req.user.id);

  if (!account) {
    return res.status(404).json({ error: 'Tài khoản không tồn tại' });
  }

  const validPassword = bcrypt.compareSync(matKhauCu, account.MatKhau);
  if (!validPassword) {
    return res.status(401).json({ error: 'Mật khẩu cũ không chính xác' });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(matKhauMoi, salt);

  db.prepare('UPDATE TaiKhoan SET MatKhau = ? WHERE id = ?').run(hashedPassword, req.user.id);

  res.json({ message: 'Đổi mật khẩu thành công' });
});

module.exports = router;
