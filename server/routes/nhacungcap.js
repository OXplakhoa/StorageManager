const express = require('express');
const router = express.Router();
const getDb = require('../database/db');
const { authenticate, requireRole } = require('../middleware/auth');

// GET /api/nhacungcap
router.get('/', authenticate, (req, res) => {
  const db = getDb();
  const items = db.prepare('SELECT * FROM NhaCungCap ORDER BY MaNCC').all();
  res.json(items);
});

// GET /api/nhacungcap/:id
router.get('/:id', authenticate, (req, res) => {
  const db = getDb();
  const item = db.prepare('SELECT * FROM NhaCungCap WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Không tìm thấy nhà cung cấp' });
  res.json(item);
});

// POST /api/nhacungcap
router.post('/', authenticate, requireRole('KeToan', 'ThuKho'), (req, res) => {
  const { MaNCC, TenNCC, DiaChi, SDT } = req.body;
  if (!MaNCC || !TenNCC) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }
  const db = getDb();
  try {
    const result = db.prepare(
      'INSERT INTO NhaCungCap (MaNCC, TenNCC, DiaChi, SDT) VALUES (?, ?, ?, ?)'
    ).run(MaNCC, TenNCC, DiaChi || '', SDT || '');
    res.status(201).json({ id: result.lastInsertRowid, message: 'Thêm NCC thành công' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Mã NCC đã tồn tại' });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/nhacungcap/:id
router.put('/:id', authenticate, requireRole('KeToan', 'ThuKho'), (req, res) => {
  const { TenNCC, DiaChi, SDT } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT * FROM NhaCungCap WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Không tìm thấy NCC' });

  db.prepare('UPDATE NhaCungCap SET TenNCC = ?, DiaChi = ?, SDT = ? WHERE id = ?').run(
    TenNCC || existing.TenNCC,
    DiaChi !== undefined ? DiaChi : existing.DiaChi,
    SDT !== undefined ? SDT : existing.SDT,
    req.params.id
  );
  res.json({ message: 'Cập nhật thành công' });
});

// DELETE /api/nhacungcap/:id
router.delete('/:id', authenticate, requireRole('KeToan', 'ThuKho'), (req, res) => {
  const db = getDb();
  const result = db.prepare('DELETE FROM NhaCungCap WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Không tìm thấy NCC' });
  res.json({ message: 'Xóa thành công' });
});

module.exports = router;
