const express = require('express');
const router = express.Router();
const getDb = require('../database/db');
const { authenticate, requireRole } = require('../middleware/auth');

// GET /api/denghi – Danh sách phiếu đề nghị xuất kho
router.get('/', authenticate, (req, res) => {
  const db = getDb();
  const list = db.prepare(`
    SELECT d.*, 
           nv.HoTen AS NguoiDeNghi, nv.BoPhan,
           hh.MaHang, hh.TenHang, hh.DVT, hh.SoLuongTonKho
    FROM PhieuDeNghiXuat d
    JOIN NhanVien nv ON d.nhan_vien_id = nv.id
    JOIN HangHoa hh ON d.hang_hoa_id = hh.id
    ORDER BY d.NgayDeNghi DESC
  `).all();
  res.json(list);
});

// POST /api/denghi – Bộ phận yêu cầu tạo phiếu đề nghị
router.post('/', authenticate, requireRole('BoPhanYC'), (req, res) => {
  const { MaDeNghi, NgayDeNghi, LyDo, hang_hoa_id, SoLuong } = req.body;

  if (!MaDeNghi || !NgayDeNghi || !LyDo || !hang_hoa_id || !SoLuong) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }

  const db = getDb();
  try {
    db.prepare(`
      INSERT INTO PhieuDeNghiXuat (MaDeNghi, NgayDeNghi, LyDo, nhan_vien_id, hang_hoa_id, SoLuong)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(MaDeNghi, NgayDeNghi, LyDo, req.user.nhan_vien_id, hang_hoa_id, SoLuong);
    res.status(201).json({ message: 'Tạo phiếu đề nghị thành công' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Mã đề nghị đã tồn tại' });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/denghi/:id/tuchoi – Thủ kho từ chối đề nghị
router.put('/:id/tuchoi', authenticate, requireRole('ThuKho'), (req, res) => {
  const { lyDo } = req.body;
  const db = getDb();
  const dn = db.prepare('SELECT * FROM PhieuDeNghiXuat WHERE id = ?').get(req.params.id);
  if (!dn) return res.status(404).json({ error: 'Không tìm thấy phiếu đề nghị' });
  if (dn.TrangThai !== 'ChoXuLy') return res.status(400).json({ error: 'Phiếu không ở trạng thái chờ xử lý' });

  db.prepare(`
    UPDATE PhieuDeNghiXuat SET TrangThai = 'TuChoi', ly_do_tu_choi = ? WHERE id = ?
  `).run(lyDo || '', req.params.id);

  res.json({ message: 'Đã từ chối đề nghị' });
});

// POST /api/denghi/:id/tao-phieu-xuat – Thủ kho tạo phiếu xuất từ đề nghị
router.post('/:id/tao-phieu-xuat', authenticate, requireRole('ThuKho'), (req, res) => {
  const { DonGia } = req.body;
  const db = getDb();
  const dn = db.prepare(`
    SELECT d.*, hh.TenHang, hh.SoLuongTonKho
    FROM PhieuDeNghiXuat d
    JOIN HangHoa hh ON d.hang_hoa_id = hh.id
    WHERE d.id = ?
  `).get(req.params.id);

  if (!dn) return res.status(404).json({ error: 'Không tìm thấy phiếu đề nghị' });
  if (dn.TrangThai !== 'ChoXuLy') return res.status(400).json({ error: 'Phiếu đã được xử lý' });
  if (dn.SoLuongTonKho < dn.SoLuong) {
    return res.status(400).json({ error: `Không đủ tồn kho: "${dn.TenHang}" (tồn: ${dn.SoLuongTonKho}, cần: ${dn.SoLuong})` });
  }

  const maPhieu = `PXK${Date.now().toString().slice(-8)}`;

  const transaction = db.transaction(() => {
    // Tạo phiếu xuất
    const result = db.prepare(`
      INSERT INTO PhieuXuatKho (MaPhieu, NgayLap, GhiChu, nhan_vien_id)
      VALUES (?, date('now'), ?, ?)
    `).run(maPhieu, `Xuất theo đề nghị ${dn.MaDeNghi}: ${dn.LyDo}`, req.user.nhan_vien_id);

    const phieuXuatId = result.lastInsertRowid;

    // Tạo chi tiết phiếu xuất
    db.prepare(`
      INSERT INTO ChiTietPhieuXuatKho (phieu_xuat_id, hang_hoa_id, SoLuong, DonGia)
      VALUES (?, ?, ?, ?)
    `).run(phieuXuatId, dn.hang_hoa_id, dn.SoLuong, DonGia || 0);

    // Cập nhật trạng thái đề nghị
    db.prepare(`
      UPDATE PhieuDeNghiXuat SET TrangThai = 'DaTaoPhieu', phieu_xuat_id = ? WHERE id = ?
    `).run(phieuXuatId, req.params.id);

    return phieuXuatId;
  });

  try {
    const phieuXuatId = transaction();
    res.status(201).json({ 
      message: `Đã tạo phiếu xuất ${maPhieu} từ đề nghị ${dn.MaDeNghi}`,
      phieuXuatId, 
      MaPhieu: maPhieu 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
