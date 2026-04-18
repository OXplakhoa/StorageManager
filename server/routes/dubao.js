const express = require('express');
const router = express.Router();
const getDb = require('../database/db');
const { authenticate, requireRole } = require('../middleware/auth');

// Gemini Flash AI integration
let genAI = null;
try {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('🤖 Gemini AI: Đã kết nối');
  }
} catch (e) {
  console.log('⚠️ Gemini AI: Không khả dụng, sử dụng mock fallback');
}

// GET /api/dubao – Danh sách kết quả dự báo
router.get('/', authenticate, requireRole('TruongKho', 'BanGD'), (req, res) => {
  const db = getDb();
  const list = db.prepare(`
    SELECT kb.*, hh.MaHang, hh.TenHang, hh.DVT, hh.SoLuongTonKho
    FROM KetQuaDuBao kb
    JOIN HangHoa hh ON kb.hang_hoa_id = hh.id
    ORDER BY kb.NgayDuBao DESC
  `).all();
  res.json(list);
});

// POST /api/dubao/generate – Dự báo cho 1 mặt hàng
router.post('/generate', authenticate, requireRole('TruongKho', 'BanGD'), async (req, res) => {
  const { hang_hoa_id } = req.body;
  if (!hang_hoa_id) {
    return res.status(400).json({ error: 'Vui lòng chọn mặt hàng' });
  }

  const db = getDb();
  const hangHoa = db.prepare('SELECT * FROM HangHoa WHERE id = ?').get(hang_hoa_id);
  if (!hangHoa) return res.status(404).json({ error: 'Không tìm thấy hàng hóa' });

  // Lấy lịch sử nhập/xuất 3 tháng gần nhất
  const lichSuNhap = db.prepare(`
    SELECT p.NgayLap, ct.SoLuong
    FROM ChiTietPhieuNhapKho ct
    JOIN PhieuNhapKho p ON ct.phieu_nhap_id = p.id
    WHERE ct.hang_hoa_id = ? AND p.TrangThai = 'DaDuyet'
      AND p.NgayLap >= date('now', '-3 months')
    ORDER BY p.NgayLap
  `).all(hang_hoa_id);

  const lichSuXuat = db.prepare(`
    SELECT p.NgayLap, ct.SoLuong
    FROM ChiTietPhieuXuatKho ct
    JOIN PhieuXuatKho p ON ct.phieu_xuat_id = p.id
    WHERE ct.hang_hoa_id = ? AND p.TrangThai = 'DaDuyet'
      AND p.NgayLap >= date('now', '-3 months')
    ORDER BY p.NgayLap
  `).all(hang_hoa_id);

  let soLuongDuBao, doChinhXac, ghiChu;

  // Thử Gemini Flash trước
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const prompt = `Bạn là chuyên gia phân tích kho hàng vật liệu xây dựng.
Dựa vào dữ liệu sau, hãy dự báo nhu cầu nhập kho cho tháng tới.

Mặt hàng: ${hangHoa.TenHang} (${hangHoa.DVT})
Tồn kho hiện tại: ${hangHoa.SoLuongTonKho}
Hạn mức tối thiểu: ${hangHoa.HanMucTonToiThieu}

Lịch sử NHẬP 3 tháng gần nhất:
${lichSuNhap.map(n => `- ${n.NgayLap}: +${n.SoLuong} ${hangHoa.DVT}`).join('\n') || 'Không có dữ liệu'}

Lịch sử XUẤT 3 tháng gần nhất:
${lichSuXuat.map(x => `- ${x.NgayLap}: -${x.SoLuong} ${hangHoa.DVT}`).join('\n') || 'Không có dữ liệu'}

Trả lời JSON duy nhất (KHÔNG giải thích):
{"soLuongDuBao": <số nguyên>, "doChinhXac": <0.0-1.0>, "ghiChu": "<lý do ngắn gọn>"}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Parse JSON từ response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        soLuongDuBao = parsed.soLuongDuBao;
        doChinhXac = parsed.doChinhXac;
        ghiChu = `[Gemini AI] ${parsed.ghiChu}`;
      }
    } catch (aiErr) {
      console.log('⚠️ Gemini API error, fallback to mock:', aiErr.message);
    }
  }

  // Mock fallback nếu Gemini không khả dụng hoặc lỗi
  if (!soLuongDuBao) {
    const tongXuat = lichSuXuat.reduce((sum, x) => sum + x.SoLuong, 0);
    const tbXuatThang = Math.ceil(tongXuat / 3) || hangHoa.HanMucTonToiThieu;
    const randomFactor = 0.9 + Math.random() * 0.2; // ± 10%
    soLuongDuBao = Math.ceil(tbXuatThang * randomFactor);
    doChinhXac = parseFloat((0.65 + Math.random() * 0.15).toFixed(2)); // 65-80%
    ghiChu = '[Mock] Dự báo dựa trên trung bình xuất kho 3 tháng';
  }

  // Lưu vào DB
  const maDuBao = `DB${Date.now()}`;
  try {
    db.prepare(`
      INSERT INTO KetQuaDuBao (MaDuBao, hang_hoa_id, DoChinhXac, NgayDuBao, SoLuongDuBao, GhiChu)
      VALUES (?, ?, ?, date('now'), ?, ?)
    `).run(maDuBao, hang_hoa_id, Math.round(doChinhXac * 100) / 100, soLuongDuBao, ghiChu);

    res.json({
      MaDuBao: maDuBao,
      hangHoa: { MaHang: hangHoa.MaHang, TenHang: hangHoa.TenHang },
      SoLuongDuBao: soLuongDuBao,
      DoChinhXac: Math.round(doChinhXac * 100) / 100,
      GhiChu: ghiChu,
      tonKhoHienTai: hangHoa.SoLuongTonKho,
      deXuatNhap: Math.max(0, soLuongDuBao - hangHoa.SoLuongTonKho + hangHoa.HanMucTonToiThieu),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
