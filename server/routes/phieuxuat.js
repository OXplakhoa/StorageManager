const express = require('express');
const router = express.Router();
const getDb = require('../database/db');
const { authenticate, requireRole } = require('../middleware/auth');
const { ghiLogTonKho } = require('./lichsu-tonkho');

// GET /api/phieuxuat
router.get('/', authenticate, (req, res) => {
  const db = getDb();
  const list = db.prepare(`
    SELECT p.*,
           nv.HoTen AS NguoiLap, nv.MaNV AS MaNVLap,
           nd.HoTen AS NguoiDuyet
    FROM PhieuXuatKho p
    JOIN NhanVien nv ON p.nhan_vien_id = nv.id
    LEFT JOIN NhanVien nd ON p.nguoi_duyet_id = nd.id
    ORDER BY p.NgayLap DESC
  `).all();
  res.json(list);
});

// GET /api/phieuxuat/:id
router.get('/:id', authenticate, (req, res) => {
  const db = getDb();
  const phieu = db.prepare(`
    SELECT p.*,
           nv.HoTen AS NguoiLap, nv.MaNV AS MaNVLap,
           nd.HoTen AS NguoiDuyet
    FROM PhieuXuatKho p
    JOIN NhanVien nv ON p.nhan_vien_id = nv.id
    LEFT JOIN NhanVien nd ON p.nguoi_duyet_id = nd.id
    WHERE p.id = ?
  `).get(req.params.id);

  if (!phieu) return res.status(404).json({ error: 'Không tìm thấy phiếu xuất' });

  const chiTiet = db.prepare(`
    SELECT ct.*, hh.MaHang, hh.TenHang, hh.DVT
    FROM ChiTietPhieuXuatKho ct
    JOIN HangHoa hh ON ct.hang_hoa_id = hh.id
    WHERE ct.phieu_xuat_id = ?
  `).all(req.params.id);

  res.json({ ...phieu, chiTiet });
});

// POST /api/phieuxuat
router.post('/', authenticate, requireRole('ThuKho'), (req, res) => {
  const { MaPhieu, NgayLap, GhiChu, chiTiet } = req.body;

  if (!MaPhieu || !NgayLap || !chiTiet || chiTiet.length === 0) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc hoặc chưa có chi tiết' });
  }

  const db = getDb();

  // Kiểm tra tồn kho trước khi tạo phiếu
  for (const ct of chiTiet) {
    const hh = db.prepare('SELECT SoLuongTonKho, TenHang FROM HangHoa WHERE id = ?').get(ct.hang_hoa_id);
    if (!hh) return res.status(400).json({ error: `Hàng hóa ID ${ct.hang_hoa_id} không tồn tại` });
    if (hh.SoLuongTonKho < ct.SoLuong) {
      return res.status(400).json({
        error: `"${hh.TenHang}" không đủ tồn kho (tồn: ${hh.SoLuongTonKho}, yêu cầu: ${ct.SoLuong})`
      });
    }
  }

  const insertPhieu = db.prepare(`
    INSERT INTO PhieuXuatKho (MaPhieu, NgayLap, GhiChu, nhan_vien_id)
    VALUES (?, ?, ?, ?)
  `);
  const insertChiTiet = db.prepare(`
    INSERT INTO ChiTietPhieuXuatKho (phieu_xuat_id, hang_hoa_id, SoLuong, DonGia)
    VALUES (?, ?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    const result = insertPhieu.run(MaPhieu, NgayLap, GhiChu || '', req.user.nhan_vien_id);
    const phieuId = result.lastInsertRowid;

    for (const ct of chiTiet) {
      insertChiTiet.run(phieuId, ct.hang_hoa_id, ct.SoLuong, ct.DonGia);
    }

    return phieuId;
  });

  try {
    const phieuId = transaction();
    res.status(201).json({ id: phieuId, message: 'Tạo phiếu xuất thành công' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Mã phiếu đã tồn tại' });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/phieuxuat/:id/duyet – Trưởng kho duyệt → trừ tồn kho
router.put('/:id/duyet', authenticate, requireRole('TruongKho'), (req, res) => {
  const db = getDb();
  const phieu = db.prepare('SELECT * FROM PhieuXuatKho WHERE id = ?').get(req.params.id);

  if (!phieu) return res.status(404).json({ error: 'Không tìm thấy phiếu' });
  if (phieu.TrangThai !== 'ChoDuyet') {
    return res.status(400).json({ error: `Phiếu đang ở trạng thái "${phieu.TrangThai}", không thể duyệt` });
  }

  const chiTiet = db.prepare('SELECT * FROM ChiTietPhieuXuatKho WHERE phieu_xuat_id = ?').all(req.params.id);

  // Kiểm tra tồn kho lần nữa trước khi duyệt
  for (const ct of chiTiet) {
    const hh = db.prepare('SELECT SoLuongTonKho, TenHang FROM HangHoa WHERE id = ?').get(ct.hang_hoa_id);
    if (hh.SoLuongTonKho < ct.SoLuong) {
      return res.status(400).json({
        error: `"${hh.TenHang}" không đủ tồn kho (tồn: ${hh.SoLuongTonKho}, yêu cầu: ${ct.SoLuong})`
      });
    }
  }

  const transaction = db.transaction(() => {
    db.prepare(`
      UPDATE PhieuXuatKho SET TrangThai = 'DaDuyet', nguoi_duyet_id = ?, ngay_duyet = datetime('now')
      WHERE id = ?
    `).run(req.user.nhan_vien_id, req.params.id);

    // Trừ tồn kho + ghi log
    for (const ct of chiTiet) {
      db.prepare('UPDATE HangHoa SET SoLuongTonKho = SoLuongTonKho - ? WHERE id = ?')
        .run(ct.SoLuong, ct.hang_hoa_id);
      ghiLogTonKho(db, ct.hang_hoa_id, 'Xuat', -ct.SoLuong, phieu.MaPhieu, `Xuất kho - ${phieu.GhiChu || ''}`);
    }
  });

  try {
    transaction();
    res.json({ message: 'Duyệt phiếu xuất thành công. Tồn kho đã cập nhật.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/phieuxuat/:id/tuchoi
router.put('/:id/tuchoi', authenticate, requireRole('TruongKho'), (req, res) => {
  const { lyDo } = req.body;
  const db = getDb();
  const phieu = db.prepare('SELECT * FROM PhieuXuatKho WHERE id = ?').get(req.params.id);

  if (!phieu) return res.status(404).json({ error: 'Không tìm thấy phiếu' });
  if (phieu.TrangThai !== 'ChoDuyet') {
    return res.status(400).json({ error: `Phiếu đang ở trạng thái "${phieu.TrangThai}"` });
  }

  db.prepare(`
    UPDATE PhieuXuatKho SET TrangThai = 'TuChoi', nguoi_duyet_id = ?, ngay_duyet = datetime('now'), ly_do_tu_choi = ?
    WHERE id = ?
  `).run(req.user.nhan_vien_id, lyDo || '', req.params.id);

  res.json({ message: 'Đã từ chối phiếu xuất' });
});

module.exports = router;
