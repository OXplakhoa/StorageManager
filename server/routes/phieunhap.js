const express = require('express');
const router = express.Router();
const getDb = require('../database/db');
const { authenticate, requireRole } = require('../middleware/auth');

// GET /api/phieunhap – Danh sách phiếu nhập kèm thông tin NV, NCC
router.get('/', authenticate, (req, res) => {
  const db = getDb();
  const list = db.prepare(`
    SELECT p.*,
           nv.HoTen AS NguoiLap, nv.MaNV AS MaNVLap,
           ncc.TenNCC, ncc.MaNCC,
           nd.HoTen AS NguoiDuyet
    FROM PhieuNhapKho p
    JOIN NhanVien nv ON p.nhan_vien_id = nv.id
    JOIN NhaCungCap ncc ON p.nha_cung_cap_id = ncc.id
    LEFT JOIN NhanVien nd ON p.nguoi_duyet_id = nd.id
    ORDER BY p.NgayLap DESC
  `).all();
  res.json(list);
});

// GET /api/phieunhap/:id – Chi tiết 1 phiếu nhập kèm danh sách dòng
router.get('/:id', authenticate, (req, res) => {
  const db = getDb();
  const phieu = db.prepare(`
    SELECT p.*,
           nv.HoTen AS NguoiLap, nv.MaNV AS MaNVLap,
           ncc.TenNCC, ncc.MaNCC,
           nd.HoTen AS NguoiDuyet
    FROM PhieuNhapKho p
    JOIN NhanVien nv ON p.nhan_vien_id = nv.id
    JOIN NhaCungCap ncc ON p.nha_cung_cap_id = ncc.id
    LEFT JOIN NhanVien nd ON p.nguoi_duyet_id = nd.id
    WHERE p.id = ?
  `).get(req.params.id);

  if (!phieu) return res.status(404).json({ error: 'Không tìm thấy phiếu nhập' });

  const chiTiet = db.prepare(`
    SELECT ct.*, hh.MaHang, hh.TenHang, hh.DVT
    FROM ChiTietPhieuNhapKho ct
    JOIN HangHoa hh ON ct.hang_hoa_id = hh.id
    WHERE ct.phieu_nhap_id = ?
  `).all(req.params.id);

  res.json({ ...phieu, chiTiet });
});

// POST /api/phieunhap – Tạo phiếu nhập + mảng chi tiết
router.post('/', authenticate, requireRole('ThuKho'), (req, res) => {
  const { MaPhieu, NgayLap, GhiChu, nha_cung_cap_id, chiTiet } = req.body;

  if (!MaPhieu || !NgayLap || !nha_cung_cap_id || !chiTiet || chiTiet.length === 0) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc hoặc chưa có chi tiết' });
  }

  const db = getDb();
  const insertPhieu = db.prepare(`
    INSERT INTO PhieuNhapKho (MaPhieu, NgayLap, GhiChu, nhan_vien_id, nha_cung_cap_id)
    VALUES (?, ?, ?, ?, ?)
  `);
  const insertChiTiet = db.prepare(`
    INSERT INTO ChiTietPhieuNhapKho (phieu_nhap_id, hang_hoa_id, SoLuong, DonGia)
    VALUES (?, ?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    const result = insertPhieu.run(MaPhieu, NgayLap, GhiChu || '', req.user.nhan_vien_id, nha_cung_cap_id);
    const phieuId = result.lastInsertRowid;

    for (const ct of chiTiet) {
      insertChiTiet.run(phieuId, ct.hang_hoa_id, ct.SoLuong, ct.DonGia);
    }

    return phieuId;
  });

  try {
    const phieuId = transaction();
    res.status(201).json({ id: phieuId, message: 'Tạo phiếu nhập thành công' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Mã phiếu đã tồn tại' });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/phieunhap/:id/duyet – Trưởng kho duyệt phiếu → cộng tồn kho
router.put('/:id/duyet', authenticate, requireRole('TruongKho'), (req, res) => {
  const db = getDb();
  const phieu = db.prepare('SELECT * FROM PhieuNhapKho WHERE id = ?').get(req.params.id);

  if (!phieu) return res.status(404).json({ error: 'Không tìm thấy phiếu' });
  if (phieu.TrangThai !== 'ChoDuyet') {
    return res.status(400).json({ error: `Phiếu đang ở trạng thái "${phieu.TrangThai}", không thể duyệt` });
  }

  const chiTiet = db.prepare('SELECT * FROM ChiTietPhieuNhapKho WHERE phieu_nhap_id = ?').all(req.params.id);

  const transaction = db.transaction(() => {
    // Cập nhật trạng thái phiếu
    db.prepare(`
      UPDATE PhieuNhapKho SET TrangThai = 'DaDuyet', nguoi_duyet_id = ?, ngay_duyet = datetime('now')
      WHERE id = ?
    `).run(req.user.nhan_vien_id, req.params.id);

    // Cộng tồn kho
    for (const ct of chiTiet) {
      db.prepare('UPDATE HangHoa SET SoLuongTonKho = SoLuongTonKho + ? WHERE id = ?')
        .run(ct.SoLuong, ct.hang_hoa_id);
    }
  });

  try {
    transaction();
    res.json({ message: 'Duyệt phiếu nhập thành công. Tồn kho đã cập nhật.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/phieunhap/:id/tuchoi – Trưởng kho từ chối phiếu
router.put('/:id/tuchoi', authenticate, requireRole('TruongKho'), (req, res) => {
  const { lyDo } = req.body;
  const db = getDb();
  const phieu = db.prepare('SELECT * FROM PhieuNhapKho WHERE id = ?').get(req.params.id);

  if (!phieu) return res.status(404).json({ error: 'Không tìm thấy phiếu' });
  if (phieu.TrangThai !== 'ChoDuyet') {
    return res.status(400).json({ error: `Phiếu đang ở trạng thái "${phieu.TrangThai}", không thể từ chối` });
  }

  db.prepare(`
    UPDATE PhieuNhapKho SET TrangThai = 'TuChoi', nguoi_duyet_id = ?, ngay_duyet = datetime('now'), ly_do_tu_choi = ?
    WHERE id = ?
  `).run(req.user.nhan_vien_id, lyDo || '', req.params.id);

  res.json({ message: 'Đã từ chối phiếu nhập' });
});

module.exports = router;
