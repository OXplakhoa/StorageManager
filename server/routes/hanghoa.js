const express = require('express');
const router = express.Router();
const getDb = require('../database/db');
const { authenticate, requireRole } = require('../middleware/auth');

// GET /api/hanghoa
router.get('/', authenticate, (req, res) => {
  const db = getDb();
  const items = db.prepare('SELECT * FROM HangHoa ORDER BY MaHang').all();
  res.json(items);
});

// GET /api/hanghoa/:id
router.get('/:id', authenticate, (req, res) => {
  const db = getDb();
  const item = db.prepare('SELECT * FROM HangHoa WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Không tìm thấy hàng hóa' });
  res.json(item);
});

// POST /api/hanghoa
router.post('/', authenticate, requireRole('KeToan', 'ThuKho'), (req, res) => {
  const { MaHang, TenHang, DVT, SoLuongTonKho, HanMucTonToiThieu } = req.body;
  if (!MaHang || !TenHang || !DVT) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }
  const db = getDb();
  try {
    const result = db.prepare(
      'INSERT INTO HangHoa (MaHang, TenHang, DVT, SoLuongTonKho, HanMucTonToiThieu) VALUES (?, ?, ?, ?, ?)'
    ).run(MaHang, TenHang, DVT, SoLuongTonKho || 0, HanMucTonToiThieu || 10);
    res.status(201).json({ id: result.lastInsertRowid, message: 'Thêm hàng hóa thành công' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Mã hàng đã tồn tại' });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/hanghoa/:id
router.put('/:id', authenticate, requireRole('KeToan', 'ThuKho'), (req, res) => {
  const { TenHang, DVT, HanMucTonToiThieu } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT * FROM HangHoa WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Không tìm thấy hàng hóa' });

  db.prepare(
    'UPDATE HangHoa SET TenHang = ?, DVT = ?, HanMucTonToiThieu = ? WHERE id = ?'
  ).run(
    TenHang || existing.TenHang,
    DVT || existing.DVT,
    HanMucTonToiThieu !== undefined ? HanMucTonToiThieu : existing.HanMucTonToiThieu,
    req.params.id
  );
  res.json({ message: 'Cập nhật thành công' });
});

// DELETE /api/hanghoa/:id
router.delete('/:id', authenticate, requireRole('KeToan', 'ThuKho'), (req, res) => {
  const db = getDb();
  const result = db.prepare('DELETE FROM HangHoa WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Không tìm thấy hàng hóa' });
  res.json({ message: 'Xóa thành công' });
});

module.exports = router;
