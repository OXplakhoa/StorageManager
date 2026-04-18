const express = require('express');
const router = express.Router();
const getDb = require('../database/db');
const { authenticate, requireRole } = require('../middleware/auth');

// GET /api/kiemke
router.get('/', authenticate, (req, res) => {
  const db = getDb();
  const list = db.prepare(`
    SELECT pk.*, nv.HoTen AS NguoiKiem, nv.MaNV
    FROM PhieuKiemKe pk
    JOIN NhanVien nv ON pk.nhan_vien_id = nv.id
    ORDER BY pk.NgayKiem DESC
  `).all();
  res.json(list);
});

// GET /api/kiemke/:id
router.get('/:id', authenticate, (req, res) => {
  const db = getDb();
  const phieu = db.prepare(`
    SELECT pk.*, nv.HoTen AS NguoiKiem, nv.MaNV
    FROM PhieuKiemKe pk
    JOIN NhanVien nv ON pk.nhan_vien_id = nv.id
    WHERE pk.id = ?
  `).get(req.params.id);

  if (!phieu) return res.status(404).json({ error: 'Không tìm thấy phiếu kiểm kê' });

  const chiTiet = db.prepare(`
    SELECT ct.*, hh.MaHang, hh.TenHang, hh.DVT, hh.SoLuongTonKho
    FROM ChiTietPhieuKiemKe ct
    JOIN HangHoa hh ON ct.hang_hoa_id = hh.id
    WHERE ct.phieu_kiem_ke_id = ?
  `).all(req.params.id);

  res.json({ ...phieu, chiTiet });
});

// POST /api/kiemke – Tạo đợt kiểm kê + chi tiết
router.post('/', authenticate, requireRole('ThuKho', 'KeToan'), (req, res) => {
  const { MaKiemKe, NgayKiem, GhiChu, chiTiet } = req.body;

  if (!MaKiemKe || !NgayKiem || !chiTiet || chiTiet.length === 0) {
    return res.status(400).json({ error: 'Thiếu thông tin hoặc chưa có chi tiết kiểm kê' });
  }

  const db = getDb();
  const transaction = db.transaction(() => {
    const result = db.prepare(`
      INSERT INTO PhieuKiemKe (MaKiemKe, NgayKiem, GhiChu, nhan_vien_id)
      VALUES (?, ?, ?, ?)
    `).run(MaKiemKe, NgayKiem, GhiChu || '', req.user.nhan_vien_id);

    const phieuId = result.lastInsertRowid;

    for (const ct of chiTiet) {
      // Lấy SoLuongSoSach hiện tại từ HangHoa
      const hh = db.prepare('SELECT SoLuongTonKho FROM HangHoa WHERE id = ?').get(ct.hang_hoa_id);
      db.prepare(`
        INSERT INTO ChiTietPhieuKiemKe (phieu_kiem_ke_id, hang_hoa_id, SoLuongThucTe, SoLuongSoSach)
        VALUES (?, ?, ?, ?)
      `).run(phieuId, ct.hang_hoa_id, ct.SoLuongThucTe, hh.SoLuongTonKho);
    }

    return phieuId;
  });

  try {
    const phieuId = transaction();
    res.status(201).json({ id: phieuId, message: 'Tạo đợt kiểm kê thành công' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Mã kiểm kê đã tồn tại' });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/kiemke/:id/hoanthanh – Hoàn thành kiểm kê (tùy chọn cập nhật tồn kho theo thực tế)
router.put('/:id/hoanthanh', authenticate, requireRole('ThuKho', 'KeToan'), (req, res) => {
  const { capNhatTonKho } = req.body; // true/false
  const db = getDb();
  const phieu = db.prepare('SELECT * FROM PhieuKiemKe WHERE id = ?').get(req.params.id);

  if (!phieu) return res.status(404).json({ error: 'Không tìm thấy phiếu kiểm kê' });
  if (phieu.TrangThai === 'HoanThanh') {
    return res.status(400).json({ error: 'Phiếu đã hoàn thành' });
  }

  const transaction = db.transaction(() => {
    db.prepare("UPDATE PhieuKiemKe SET TrangThai = 'HoanThanh' WHERE id = ?").run(req.params.id);

    if (capNhatTonKho) {
      const chiTiet = db.prepare('SELECT * FROM ChiTietPhieuKiemKe WHERE phieu_kiem_ke_id = ?').all(req.params.id);
      for (const ct of chiTiet) {
        db.prepare('UPDATE HangHoa SET SoLuongTonKho = ? WHERE id = ?')
          .run(ct.SoLuongThucTe, ct.hang_hoa_id);
      }
    }
  });

  try {
    transaction();
    res.json({ message: 'Hoàn thành kiểm kê' + (capNhatTonKho ? '. Tồn kho đã cập nhật theo thực tế.' : '.') });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
