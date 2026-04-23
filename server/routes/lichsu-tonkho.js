const express = require('express');
const router = express.Router();
const getDb = require('../database/db');
const { authenticate } = require('../middleware/auth');

// GET /api/lichsu-tonkho – Lịch sử biến động tồn kho
// Query params: ?hang_hoa_id=1 (optional filter)
router.get('/', authenticate, (req, res) => {
  const { hang_hoa_id } = req.query;
  const db = getDb();

  let query = `
    SELECT ls.*, hh.MaHang, hh.TenHang, hh.DVT
    FROM LichSuTonKho ls
    JOIN HangHoa hh ON ls.hang_hoa_id = hh.id
  `;
  const params = [];

  if (hang_hoa_id) {
    query += ' WHERE ls.hang_hoa_id = ?';
    params.push(hang_hoa_id);
  }

  query += ' ORDER BY ls.NgayGhiNhan DESC, ls.id DESC LIMIT 200';

  const items = db.prepare(query).all(...params);
  res.json(items);
});

module.exports = router;

// ============================================
// Helper: Ghi log biến động tồn kho
// Dùng trong phieunhap.js / phieuxuat.js khi duyệt phiếu
// ============================================
function ghiLogTonKho(db, hang_hoa_id, loai, soLuong, maChungTu, ghiChu) {
  const hh = db.prepare('SELECT SoLuongTonKho FROM HangHoa WHERE id = ?').get(hang_hoa_id);
  if (!hh) return;

  db.prepare(`
    INSERT INTO LichSuTonKho (hang_hoa_id, LoaiBienDong, SoLuongThayDoi, TonKhoSau, MaChungTu, GhiChu)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(hang_hoa_id, loai, soLuong, hh.SoLuongTonKho, maChungTu, ghiChu || '');
}

module.exports = router;
module.exports.ghiLogTonKho = ghiLogTonKho;
