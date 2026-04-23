const fs = require('fs');

const nhanVien = [
  { id: 1, ma: 'NV001', ten: 'Đỗ Hoàng Anh Khoa', sdt: '0901234561', bp: 'Kho', vaitro: 'TruongKho', tk: 'truongkho' },
  { id: 2, ma: 'NV002', ten: 'Dương Minh Nghĩa', sdt: '0901234562', bp: 'Kho', vaitro: 'ThuKho', tk: 'thukho1' },
  { id: 3, ma: 'NV003', ten: 'Nguyễn Văn Khoa', sdt: '0901234563', bp: 'Kho', vaitro: 'ThuKho', tk: 'thukho2' },
  { id: 4, ma: 'NV004', ten: 'Bùi Xuân Hiếu', sdt: '0901234564', bp: 'Kế toán', vaitro: 'KeToan', tk: 'ketoan' },
  { id: 5, ma: 'NV005', ten: 'Huỳnh Minh Quân', sdt: '0901234565', bp: 'Kinh doanh', vaitro: 'BoPhanYC', tk: 'kinhdoanh1' },
  { id: 6, ma: 'NV006', ten: 'Trần Ban Giám Đốc', sdt: '0901234566', bp: 'Ban Giám đốc', vaitro: 'BanGD', tk: 'giamdoc' },
  { id: 7, ma: 'NV007', ten: 'Lê Yêu Cầu Một', sdt: '0901234567', bp: 'Dự án', vaitro: 'BoPhanYC', tk: 'duan1' },
  { id: 8, ma: 'NV008', ten: 'Phạm Yêu Cầu Hai', sdt: '0901234568', bp: 'Kinh doanh', vaitro: 'BoPhanYC', tk: 'kinhdoanh2' }
];

const nhaCungCap = [
  { id: 1, ma: 'NCC001', ten: 'Unilever Việt Nam', dia: 'KCN Tây Bắc Củ Chi, TP.HCM' },
  { id: 2, ma: 'NCC002', ten: 'Masan Consumer', dia: 'Tòa nhà MPlaza, Q.1, TP.HCM' },
  { id: 3, ma: 'NCC003', ten: 'Abbott Việt Nam', dia: 'Melinh Point Tower, Q.1, TP.HCM' },
  { id: 4, ma: 'NCC004', ten: 'Vinamilk', dia: 'Số 10 Tân Trào, Q.7, TP.HCM' },
  { id: 5, ma: 'NCC005', ten: 'Tập đoàn Hòa Bình', dia: 'Tòa nhà Pax Sky, Q.3, TP.HCM' },
  { id: 6, ma: 'NCC006', ten: 'Coteccons', dia: 'Tòa nhà Coteccons, Q.Bình Thạnh, TP.HCM' },
  { id: 7, ma: 'NCC007', ten: 'Thép Hòa Phát', dia: 'KCN Phố Nối A, Hưng Yên' },
  { id: 8, ma: 'NCC008', ten: 'Xi măng Hà Tiên', dia: 'Số 360 Bến Chương Dương, Q.1, TP.HCM' }
];

const hangHoa = [
  { id: 1, ma: 'HH001', ten: 'Bột giặt Omo 3kg', dvt: 'Túi', hm: 50, ncc: 1, type: 'FMCG' },
  { id: 2, ma: 'HH002', ten: 'Dầu gội Clear Men', dvt: 'Chai', hm: 30, ncc: 1, type: 'FMCG' },
  { id: 3, ma: 'HH003', ten: 'Nước mắm Nam Ngư 500ml', dvt: 'Chai', hm: 100, ncc: 2, type: 'FMCG' },
  { id: 4, ma: 'HH004', ten: 'Mì Omachi Xốt Vang', dvt: 'Thùng', hm: 50, ncc: 2, type: 'FMCG' },
  { id: 5, ma: 'HH005', ten: 'Sữa Ensure Gold 850g', dvt: 'Hộp', hm: 20, ncc: 3, type: 'FMCG' },
  { id: 6, ma: 'HH006', ten: 'Sữa tươi Vinamilk 1L', dvt: 'Thùng', hm: 100, ncc: 4, type: 'FMCG' },
  { id: 7, ma: 'HH007', ten: 'Sữa chua Vinamilk nha đam', dvt: 'Thùng', hm: 50, ncc: 4, type: 'FMCG' },
  { id: 8, ma: 'HH008', ten: 'Xi măng Hà Tiên PCB40', dvt: 'Bao (50kg)', hm: 200, ncc: 8, type: 'XD' },
  { id: 9, ma: 'HH009', ten: 'Thép cuộn D10 Hòa Phát', dvt: 'Cuộn', hm: 50, ncc: 7, type: 'XD' },
  { id: 10, ma: 'HH010', ten: 'Gạch Tuynel 4 lỗ', dvt: 'Viên', hm: 5000, ncc: 5, type: 'XD' },
  { id: 11, ma: 'HH011', ten: 'Sơn nội thất Dulux 5L', dvt: 'Thùng', hm: 30, ncc: 6, type: 'XD' },
  { id: 12, ma: 'HH012', ten: 'Ống nhựa Bình Minh Phi 21', dvt: 'Cây', hm: 100, ncc: 6, type: 'XD' },
  { id: 13, ma: 'HH013', ten: 'Cát xây tô', dvt: 'Khối', hm: 50, ncc: 5, type: 'XD' },
  { id: 14, ma: 'HH014', ten: 'Đá 1x2', dvt: 'Khối', hm: 50, ncc: 5, type: 'XD' },
  { id: 15, ma: 'HH015', ten: 'Dây điện Cadivi 2.0', dvt: 'Cuộn', hm: 20, ncc: 6, type: 'XD' }
];

let out = `-- ============================================================
-- SEED DATA FMCG & CONSTRUCTION (Sinh tự động)
-- Mật khẩu mặc định: 123456
-- ============================================================

INSERT INTO NhanVien (MaNV, HoTen, SDT, DiaChi, NgaySinh, BoPhan) VALUES\n`;
out += nhanVien.map(n => `('${n.ma}', '${n.ten}', '${n.sdt}', 'Địa chỉ ${n.ma}', '1990-01-01', '${n.bp}')`).join(',\n') + ';\n\n';

out += `INSERT INTO TaiKhoan (TenDangNhap, MatKhau, VaiTro, TrangThai, nhan_vien_id) VALUES\n`;
out += nhanVien.map(n => `('${n.tk}', '__HASH__', '${n.vaitro}', 'HoatDong', ${n.id})`).join(',\n') + ';\n\n';

out += `INSERT INTO NhaCungCap (MaNCC, TenNCC, DiaChi, SDT) VALUES\n`;
out += nhaCungCap.map(n => `('${n.ma}', '${n.ten}', '${n.dia}', '090000000${n.id}')`).join(',\n') + ';\n\n';

out += `INSERT INTO HangHoa (MaHang, TenHang, DVT, SoLuongTonKho, HanMucTonToiThieu) VALUES\n`;
out += hangHoa.map(h => `('${h.ma}', '${h.ten}', '${h.dvt}', 0, ${h.hm})`).join(',\n') + ';\n\n';

let currentDate = new Date('2025-10-01');
const endDate = new Date('2026-04-20');

let tonKho = {};
hangHoa.forEach(h => tonKho[h.id] = 0);

let logs = [];
let pnkList = [];
let pxkList = [];
let pkkList = [];
let ctpnk = [];
let ctpxk = [];
let ctpkk = [];

let pnkCounter = 1;
let pxkCounter = 1;
let pkkCounter = 1;

while(currentDate <= endDate) {
  // Every 3 days, have some imports
  if (Math.random() < 0.4) {
    let dateStr = currentDate.toISOString().split('T')[0];
    let itemsToImport = hangHoa.filter(h => Math.random() < 0.3);
    if (itemsToImport.length > 0) {
      let phieuId = pnkCounter++;
      let maP = `PNK${String(phieuId).padStart(3, '0')}`;
      pnkList.push({ id: phieuId, ma: maP, d: dateStr, st: 'DaDuyet', nv: 2, ncc: itemsToImport[0].ncc, nd: 1 });
      
      itemsToImport.forEach(h => {
        let sl = Math.floor(Math.random() * 50) + h.hm;
        ctpnk.push({ pid: phieuId, hid: h.id, sl: sl, dg: 50000 });
        tonKho[h.id] += sl;
        logs.push({ hid: h.id, d: dateStr, type: 'Nhap', change: sl, ton: tonKho[h.id], chungtu: maP });
      });
    }
  }

  // Every 2 days, have some exports
  if (Math.random() < 0.5) {
    let dateStr = currentDate.toISOString().split('T')[0];
    let itemsToExport = hangHoa.filter(h => tonKho[h.id] > h.hm / 2 && Math.random() < 0.4);
    if (itemsToExport.length > 0) {
      let phieuId = pxkCounter++;
      let maP = `PXK${String(phieuId).padStart(3, '0')}`;
      pxkList.push({ id: phieuId, ma: maP, d: dateStr, st: 'DaDuyet', nv: 3, nd: 1 });
      
      itemsToExport.forEach(h => {
        let sl = Math.floor(Math.random() * (tonKho[h.id] / 2)) + 1;
        ctpxk.push({ pid: phieuId, hid: h.id, sl: sl, dg: 60000 });
        tonKho[h.id] -= sl;
        logs.push({ hid: h.id, d: dateStr, type: 'Xuat', change: -sl, ton: tonKho[h.id], chungtu: maP });
      });
    }
  }

  // Every 60 days, inventory check
  if (currentDate.getDate() === 28 && currentDate.getMonth() % 2 === 0) {
    let dateStr = currentDate.toISOString().split('T')[0];
    let phieuId = pkkCounter++;
    let maP = `PKK${String(phieuId).padStart(3, '0')}`;
    pkkList.push({ id: phieuId, ma: maP, d: dateStr, st: 'HoanThanh', nv: 2 });
    
    hangHoa.forEach(h => {
      let thucTe = tonKho[h.id];
      if (Math.random() < 0.1) {
        thucTe = Math.max(0, thucTe - Math.floor(Math.random() * 5));
      }
      ctpkk.push({ pid: phieuId, hid: h.id, tt: thucTe, ss: tonKho[h.id] });
      
      if (thucTe !== tonKho[h.id]) {
        let diff = thucTe - tonKho[h.id];
        tonKho[h.id] = thucTe;
        logs.push({ hid: h.id, d: dateStr, type: 'KiemKe', change: diff, ton: tonKho[h.id], chungtu: maP });
      }
    });
  }

  currentDate.setDate(currentDate.getDate() + 1);
}

// Generate some pending ones
pnkList.push({ id: pnkCounter++, ma: 'PNK998', d: '2026-04-21', st: 'ChoDuyet', nv: 2, ncc: 1, nd: 'NULL' });
pnkList.push({ id: pnkCounter++, ma: 'PNK999', d: '2026-04-22', st: 'TuChoi', nv: 3, ncc: 2, nd: 'NULL' });
pxkList.push({ id: pxkCounter++, ma: 'PXK998', d: '2026-04-21', st: 'ChoDuyet', nv: 3, nd: 'NULL' });

out += `-- CẬP NHẬT TỒN KHO CUỐI CÙNG\n`;
hangHoa.forEach(h => {
  out += `UPDATE HangHoa SET SoLuongTonKho = ${tonKho[h.id]} WHERE id = ${h.id};\n`;
});
out += '\n';

// Chunk lists to SQL
function makeInsert(table, cols, rows, formatFn) {
  if (rows.length === 0) return '';
  let str = `INSERT INTO ${table} (${cols.join(', ')}) VALUES\n`;
  let chunks = [];
  for(let i=0; i<rows.length; i+=50) {
    chunks.push(rows.slice(i, i+50).map(formatFn).join(',\n'));
  }
  return str + chunks.join(';\n' + str) + ';\n\n';
}

out += makeInsert('PhieuNhapKho', ['id', 'MaPhieu', 'NgayLap', 'TrangThai', 'GhiChu', 'nhan_vien_id', 'nha_cung_cap_id', 'nguoi_duyet_id', 'ngay_duyet'], pnkList, 
  r => `(${r.id}, '${r.ma}', '${r.d}', '${r.st}', 'Ghi chú ${r.ma}', ${r.nv}, ${r.ncc}, ${r.nd}, ${r.nd === 'NULL' ? 'NULL' : `'${r.d}'`})`);

out += makeInsert('ChiTietPhieuNhapKho', ['phieu_nhap_id', 'hang_hoa_id', 'SoLuong', 'DonGia'], ctpnk,
  r => `(${r.pid}, ${r.hid}, ${r.sl}, ${r.dg})`);

out += makeInsert('PhieuXuatKho', ['id', 'MaPhieu', 'NgayLap', 'TrangThai', 'GhiChu', 'nhan_vien_id', 'nguoi_duyet_id', 'ngay_duyet'], pxkList,
  r => `(${r.id}, '${r.ma}', '${r.d}', '${r.st}', 'Xuất ${r.ma}', ${r.nv}, ${r.nd}, ${r.nd === 'NULL' ? 'NULL' : `'${r.d}'`})`);

out += makeInsert('ChiTietPhieuXuatKho', ['phieu_xuat_id', 'hang_hoa_id', 'SoLuong', 'DonGia'], ctpxk,
  r => `(${r.pid}, ${r.hid}, ${r.sl}, ${r.dg})`);

out += makeInsert('PhieuKiemKe', ['id', 'MaKiemKe', 'NgayKiem', 'TrangThai', 'nhan_vien_id'], pkkList,
  r => `(${r.id}, '${r.ma}', '${r.d}', '${r.st}', ${r.nv})`);

out += makeInsert('ChiTietPhieuKiemKe', ['phieu_kiem_ke_id', 'hang_hoa_id', 'SoLuongThucTe', 'SoLuongSoSach'], ctpkk,
  r => `(${r.pid}, ${r.hid}, ${r.tt}, ${r.ss})`);

out += makeInsert('LichSuTonKho', ['hang_hoa_id', 'NgayGhiNhan', 'LoaiBienDong', 'SoLuongThayDoi', 'TonKhoSau', 'MaChungTu', 'GhiChu'], logs,
  r => `(${r.hid}, '${r.d} 08:00:00', '${r.type}', ${r.change}, ${r.ton}, '${r.chungtu}', 'Tự động seed')`);

// De nghi xuat
out += `INSERT INTO PhieuDeNghiXuat (MaDeNghi, NgayDeNghi, LyDo, TrangThai, nhan_vien_id, hang_hoa_id, SoLuong) VALUES
('DNX001', '2026-04-10', 'Xin xuất hàng mẫu Unilever', 'ChoXuLy', 5, 1, 5),
('DNX002', '2026-04-12', 'Vật tư cho Vinamilk', 'ChoXuLy', 5, 6, 10),
('DNX003', '2026-04-15', 'Cần thép dự án Coteccons', 'DaXuat', 7, 9, 20),
('DNX004', '2026-04-18', 'Mì tôm nội bộ', 'TuChoi', 8, 4, 10);
`;

fs.writeFileSync('seed.sql', out);
console.log('Generated seed.sql with ' + out.split('\n').length + ' lines.');
