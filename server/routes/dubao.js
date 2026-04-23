const express = require('express');
const router = express.Router();
const getDb = require('../database/db');
const { authenticate, requireRole } = require('../middleware/auth');

console.log('[dubao] route module loaded');

// Gemini Flash AI integration
let genAI = null;
try {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('[dubao] Gemini AI initialized, apiKey present = true');
  } else {
    console.log('[dubao] Gemini AI not initialized, GEMINI_API_KEY missing');
  }
} catch (e) {
  console.log('[dubao] Gemini AI unavailable, fallback enabled:', e.message);
}

// GET /api/dubao – Danh sách kết quả dự báo
router.get('/', authenticate, requireRole('TruongKho', 'BanGD'), (req, res) => {
  console.log('[dubao] GET /api/dubao', { user: req.user?.TenDangNhap, role: req.user?.VaiTro });
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
  console.log('[dubao] POST /api/dubao/generate entered', {
    user: req.user?.TenDangNhap,
    role: req.user?.VaiTro,
    body: req.body,
  });

  const { hang_hoa_id } = req.body;
  if (!hang_hoa_id) {
    console.log('[dubao] missing hang_hoa_id');
    return res.status(400).json({ error: 'Vui lòng chọn mặt hàng' });
  }

  console.log('[dubao] lookup hangHoa start', { hang_hoa_id });

  const db = getDb();
  const hangHoa = db.prepare('SELECT * FROM HangHoa WHERE id = ?').get(hang_hoa_id);
  if (!hangHoa) {
    console.log('[dubao] hangHoa not found', { hang_hoa_id });
    return res.status(404).json({ error: 'Không tìm thấy hàng hóa' });
  }
  console.log('[dubao] hangHoa found', { id: hangHoa.id, MaHang: hangHoa.MaHang, TenHang: hangHoa.TenHang, DVT: hangHoa.DVT });

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

  console.log('[dubao] history loaded', {
    lichSuNhapCount: lichSuNhap.length,
    lichSuXuatCount: lichSuXuat.length,
  });

  let soLuongDuBao, doChinhXac, ghiChu;
  let geminiSuccess = false;

  // Thử Gemini Flash trước
  if (genAI) {
    try {
      const modelName = 'gemini-3-flash-preview';
      console.log('[dubao] invoking Gemini model', { modelName });
      const model = genAI.getGenerativeModel({ model: modelName });
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

      console.log('[dubao] Gemini prompt prepared', {
        promptLength: prompt.length,
        tenHang: hangHoa.TenHang,
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Log response để debug
      console.log('[dubao] Gemini AI raw response:', text);

      // Parse JSON từ response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.soLuongDuBao !== undefined && parsed.doChinhXac !== undefined) {
          soLuongDuBao = parsed.soLuongDuBao;
          doChinhXac = parsed.doChinhXac;
          ghiChu = `[Gemini AI] ${parsed.ghiChu || 'Không có ghi chú'}`;
          geminiSuccess = true;
          
          console.log('[dubao] Gemini parsed response successfully', {
            soLuongDuBao,
            doChinhXac,
            ghiChu,
          });
        } else {
          console.log('[dubao] Gemini response missing required fields, will fallback');
        }
      } else {
        console.log('[dubao] Gemini response had no JSON payload, will fallback');
      }
    } catch (aiErr) {
      console.log('[dubao] Gemini API error, fallback to mock:', aiErr.message);
    }
  } else {
    console.log('[dubao] Gemini client unavailable, skip AI and fallback to mock');
  }

  // Mock fallback nếu Gemini không khả dụng hoặc lỗi
  if (!geminiSuccess) {
    console.log('[dubao] entering fallback path');
    const tongXuat = lichSuXuat.reduce((sum, x) => sum + x.SoLuong, 0);
    const tbXuatThang = Math.ceil(tongXuat / 3) || hangHoa.HanMucTonToiThieu;
    const randomFactor = 0.9 + Math.random() * 0.2; // ± 10%
    soLuongDuBao = Math.ceil(tbXuatThang * randomFactor);
    doChinhXac = parseFloat((0.65 + Math.random() * 0.15).toFixed(2)); // 65-80%
    ghiChu = '[Mock] Dự báo dựa trên trung bình xuất kho 3 tháng';
    console.log('[dubao] fallback generated values', {
      tongXuat,
      tbXuatThang,
      randomFactor,
      soLuongDuBao,
      doChinhXac,
      ghiChu,
    });
  }

  // Lưu vào DB
  const maDuBao = `DB${Date.now()}`;
  try {
    console.log('[dubao] inserting forecast result', { maDuBao, hang_hoa_id, soLuongDuBao, doChinhXac, ghiChu });
    db.prepare(`
      INSERT INTO KetQuaDuBao (MaDuBao, hang_hoa_id, DoChinhXac, NgayDuBao, SoLuongDuBao, GhiChu)
      VALUES (?, ?, ?, date('now'), ?, ?)
    `).run(maDuBao, hang_hoa_id, Math.round(doChinhXac * 100) / 100, soLuongDuBao, ghiChu);

    const response = {
      MaDuBao: maDuBao,
      hangHoa: { MaHang: hangHoa.MaHang, TenHang: hangHoa.TenHang },
      SoLuongDuBao: soLuongDuBao,
      DoChinhXac: Math.round(doChinhXac * 100) / 100,
      GhiChu: ghiChu,
      tonKhoHienTai: hangHoa.SoLuongTonKho,
      deXuatNhap: Math.max(0, soLuongDuBao - hangHoa.SoLuongTonKho + hangHoa.HanMucTonToiThieu),
    };
    console.log('[dubao] sending response', response);
    res.json(response);
  } catch (err) {
    console.log('[dubao] database insert error', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
