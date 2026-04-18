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

module.exports = router;
