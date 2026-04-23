const express = require('express');
const router = express.Router();
const getDb = require('../database/db');
const { authenticate, requireRole } = require('../middleware/auth');

// GET /api/baocao/nhap-xuat-ton – Báo cáo NXT theo kỳ
router.get('/nhap-xuat-ton', authenticate, requireRole('TruongKho', 'KeToan', 'BanGD'), (req, res) => {
  const { tuNgay, denNgay } = req.query;
  const db = getDb();

  const items = db.prepare('SELECT id, MaHang, TenHang, DVT, SoLuongTonKho FROM HangHoa ORDER BY MaHang').all();

  const result = items.map(item => {
    // Tổng nhập (chỉ phiếu đã duyệt)
    let nhapQuery = `
      SELECT COALESCE(SUM(ct.SoLuong), 0) as tongNhap
      FROM ChiTietPhieuNhapKho ct
      JOIN PhieuNhapKho p ON ct.phieu_nhap_id = p.id
      WHERE ct.hang_hoa_id = ? AND p.TrangThai = 'DaDuyet'
    `;
    let nhapParams = [item.id];

    if (tuNgay && denNgay) {
      nhapQuery += ' AND p.NgayLap BETWEEN ? AND ?';
      nhapParams.push(tuNgay, denNgay);
    }

    const nhap = db.prepare(nhapQuery).get(...nhapParams);

    // Tổng xuất (chỉ phiếu đã duyệt)
    let xuatQuery = `
      SELECT COALESCE(SUM(ct.SoLuong), 0) as tongXuat
      FROM ChiTietPhieuXuatKho ct
      JOIN PhieuXuatKho p ON ct.phieu_xuat_id = p.id
      WHERE ct.hang_hoa_id = ? AND p.TrangThai = 'DaDuyet'
    `;
    let xuatParams = [item.id];

    if (tuNgay && denNgay) {
      xuatQuery += ' AND p.NgayLap BETWEEN ? AND ?';
      xuatParams.push(tuNgay, denNgay);
    }

    const xuat = db.prepare(xuatQuery).get(...xuatParams);

    return {
      ...item,
      tongNhap: nhap.tongNhap,
      tongXuat: xuat.tongXuat,
    };
  });

  res.json(result);
});

// GET /api/baocao/ton-kho – Tồn kho hiện tại
router.get('/ton-kho', authenticate, requireRole('TruongKho', 'KeToan', 'BanGD'), (req, res) => {
  const db = getDb();
  const items = db.prepare(`
    SELECT id, MaHang, TenHang, DVT, SoLuongTonKho, HanMucTonToiThieu,
           CASE WHEN SoLuongTonKho <= HanMucTonToiThieu THEN 1 ELSE 0 END AS CanhBao
    FROM HangHoa
    ORDER BY MaHang
  `).all();
  res.json(items);
});

// GET /api/baocao/duoi-muc-toi-thieu – Hàng dưới mức tối thiểu
router.get('/duoi-muc-toi-thieu', authenticate, requireRole('TruongKho', 'KeToan', 'BanGD'), (req, res) => {
  const db = getDb();
  const items = db.prepare(`
    SELECT id, MaHang, TenHang, DVT, SoLuongTonKho, HanMucTonToiThieu,
           (HanMucTonToiThieu - SoLuongTonKho) AS ThieuHut
    FROM HangHoa
    WHERE SoLuongTonKho <= HanMucTonToiThieu
    ORDER BY ThieuHut DESC
  `).all();
  res.json(items);
});

// GET /api/baocao/dashboard-stats – Thống kê cho Dashboard
router.get('/dashboard-stats', authenticate, (req, res) => {
  const db = getDb();

  const tongHangHoa = db.prepare('SELECT COUNT(*) as c FROM HangHoa').get().c;
  const tongPhieuNhap = db.prepare('SELECT COUNT(*) as c FROM PhieuNhapKho').get().c;
  const tongPhieuXuat = db.prepare('SELECT COUNT(*) as c FROM PhieuXuatKho').get().c;
  const phieuChoDuyet = db.prepare(`
    SELECT COUNT(*) as c FROM (
      SELECT id FROM PhieuNhapKho WHERE TrangThai = 'ChoDuyet'
      UNION ALL
      SELECT id FROM PhieuXuatKho WHERE TrangThai = 'ChoDuyet'
    )
  `).get().c;
  const hangCanhBao = db.prepare(
    'SELECT COUNT(*) as c FROM HangHoa WHERE SoLuongTonKho <= HanMucTonToiThieu'
  ).get().c;

  // Nhập/Xuất gần đây (5 phiếu mới nhất)
  const phieuGanDay = db.prepare(`
    SELECT MaPhieu, NgayLap, TrangThai, 'Nhap' as Loai FROM PhieuNhapKho
    UNION ALL
    SELECT MaPhieu, NgayLap, TrangThai, 'Xuat' as Loai FROM PhieuXuatKho
    ORDER BY NgayLap DESC LIMIT 5
  `).all();

  res.json({
    tongHangHoa,
    tongPhieuNhap,
    tongPhieuXuat,
    phieuChoDuyet,
    hangCanhBao,
    phieuGanDay,
  });
});

// ============================================
// CHART APIs (cho Dashboard biểu đồ)
// ============================================

// GET /api/baocao/chart-nhap-xuat-thang – Nhập/Xuất theo tháng (6 tháng gần nhất)
router.get('/chart-nhap-xuat-thang', authenticate, (req, res) => {
  const db = getDb();

  const nhapTheoThang = db.prepare(`
    SELECT strftime('%Y-%m', p.NgayLap) AS thang,
           COALESCE(SUM(ct.SoLuong), 0) AS tong
    FROM PhieuNhapKho p
    JOIN ChiTietPhieuNhapKho ct ON ct.phieu_nhap_id = p.id
    WHERE p.TrangThai = 'DaDuyet'
      AND p.NgayLap >= date('now', '-6 months')
    GROUP BY thang
    ORDER BY thang
  `).all();

  const xuatTheoThang = db.prepare(`
    SELECT strftime('%Y-%m', p.NgayLap) AS thang,
           COALESCE(SUM(ct.SoLuong), 0) AS tong
    FROM PhieuXuatKho p
    JOIN ChiTietPhieuXuatKho ct ON ct.phieu_xuat_id = p.id
    WHERE p.TrangThai = 'DaDuyet'
      AND p.NgayLap >= date('now', '-6 months')
    GROUP BY thang
    ORDER BY thang
  `).all();

  // Gom tất cả tháng có dữ liệu
  const allMonths = [...new Set([
    ...nhapTheoThang.map(r => r.thang),
    ...xuatTheoThang.map(r => r.thang)
  ])].sort();

  const result = allMonths.map(thang => ({
    thang,
    nhap: nhapTheoThang.find(r => r.thang === thang)?.tong || 0,
    xuat: xuatTheoThang.find(r => r.thang === thang)?.tong || 0,
  }));

  res.json(result);
});

// GET /api/baocao/chart-hang-theo-dvt – Hàng hóa gom theo ĐVT (cho Pie chart)
router.get('/chart-hang-theo-dvt', authenticate, (req, res) => {
  const db = getDb();
  const items = db.prepare(`
    SELECT DVT as label, COUNT(*) as value
    FROM HangHoa
    GROUP BY DVT
    ORDER BY value DESC
  `).all();
  res.json(items);
});

// GET /api/baocao/canh-bao-ton-kho – Cảnh báo tồn kho (cho Sidebar badge + Dashboard card)
router.get('/canh-bao-ton-kho', authenticate, (req, res) => {
  const db = getDb();
  const items = db.prepare(`
    SELECT id, MaHang, TenHang, DVT, SoLuongTonKho, HanMucTonToiThieu,
           (HanMucTonToiThieu - SoLuongTonKho) AS ThieuHut
    FROM HangHoa
    WHERE SoLuongTonKho < HanMucTonToiThieu
    ORDER BY ThieuHut DESC
  `).all();
  res.json({ count: items.length, items });
});

// GET /api/baocao/chart-top5-xuat – Top 5 hàng xuất nhiều nhất
router.get('/chart-top5-xuat', authenticate, (req, res) => {
  const db = getDb();
  const items = db.prepare(`
    SELECT hh.TenHang, SUM(ct.SoLuong) as TongXuat
    FROM ChiTietPhieuXuatKho ct
    JOIN HangHoa hh ON ct.hang_hoa_id = hh.id
    JOIN PhieuXuatKho p ON ct.phieu_xuat_id = p.id
    WHERE p.TrangThai = 'DaDuyet'
    GROUP BY hh.id
    ORDER BY TongXuat DESC
    LIMIT 5
  `).all();
  res.json(items);
});

module.exports = router;
