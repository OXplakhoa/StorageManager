-- ============================================================
-- SEED DATA – Dữ liệu mẫu (3 tháng: 02/2026 → 04/2026)
-- Mật khẩu mặc định cho tất cả: 123456
-- ============================================================

-- ============================================
-- NHÂN VIÊN (6 người)
-- ============================================
INSERT INTO NhanVien (MaNV, HoTen, SDT, DiaChi, NgaySinh, BoPhan) VALUES
('NV001', 'Nguyễn Văn Hùng',   '0901234561', '12 Lý Thường Kiệt, Q.10',  '1985-03-15', 'Kho'),
('NV002', 'Trần Thị Mai',      '0901234562', '45 Nguyễn Huệ, Q.1',      '1990-07-22', 'Kho'),
('NV003', 'Lê Hoàng Nam',      '0901234563', '78 Cách Mạng Tháng 8, Q.3','1988-11-10', 'Kho'),
('NV004', 'Phạm Thị Lan',      '0901234564', '23 Hai Bà Trưng, Q.1',    '1992-01-05', 'Kế toán'),
('NV005', 'Võ Minh Tuấn',      '0901234565', '56 Điện Biên Phủ, Q.BT',  '1995-09-18', 'Kinh doanh'),
('NV006', 'Hoàng Đức Thắng',   '0901234566', '90 Nguyễn Văn Trỗi, Q.PN','1980-05-30', 'Ban Giám đốc');

-- ============================================
-- TÀI KHOẢN (6 tài khoản, password = bcrypt hash of "123456")
-- Hash: $2a$10$xVqYLGJMZ1v3TGx1v3TGx.abcdefghijklmnopqrstuvwxyz12
-- Sẽ được hash đúng trong db.js khi seed
-- ============================================
INSERT INTO TaiKhoan (TenDangNhap, MatKhau, VaiTro, TrangThai, nhan_vien_id) VALUES
('truongkho', '__HASH__', 'TruongKho', 'HoatDong', 1),
('thukho1',   '__HASH__', 'ThuKho',    'HoatDong', 2),
('thukho2',   '__HASH__', 'ThuKho',    'HoatDong', 3),
('ketoan',    '__HASH__', 'KeToan',    'HoatDong', 4),
('bopyc',     '__HASH__', 'BoPhanYC',  'HoatDong', 5),
('giamDoc',   '__HASH__', 'BanGD',     'HoatDong', 6);

-- ============================================
-- NHÀ CUNG CẤP (5 NCC)
-- ============================================
INSERT INTO NhaCungCap (MaNCC, TenNCC, DiaChi, SDT) VALUES
('NCC001', 'Công ty TNHH Phát Đạt',       '100 Quốc lộ 1A, Q.12, TP.HCM',  '02812345001'),
('NCC002', 'Công ty CP Vật tư Miền Nam',   '250 Trường Chinh, Q.TB, TP.HCM', '02812345002'),
('NCC003', 'DNTN Hoàng Long',              '55 Lê Lợi, TP. Biên Hòa',       '02513456001'),
('NCC004', 'Công ty TNHH Thiên Phú',       '88 Nguyễn Ái Quốc, Biên Hòa',   '02513456002'),
('NCC005', 'Công ty CP Đại Phong',         '12 Phạm Văn Đồng, Q.TĐ, TP.HCM','02812345005');

-- ============================================
-- HÀNG HÓA (15 mặt hàng, đa dạng DVT + tồn kho)
-- ============================================
INSERT INTO HangHoa (MaHang, TenHang, DVT, SoLuongTonKho, HanMucTonToiThieu) VALUES
('HH001', 'Xi măng PCB40',          'Bao (50kg)',  120, 50),
('HH002', 'Thép cuộn Φ10',          'Cuộn',         35, 20),
('HH003', 'Gạch ống 4 lỗ',          'Viên',       2500, 1000),
('HH004', 'Sơn nước nội thất 5L',   'Thùng',        80, 30),
('HH005', 'Ống nhựa PVC Φ21',       'Cây (4m)',    200, 100),
('HH006', 'Dây điện 2x1.5mm',       'Cuộn (100m)', 45, 20),
('HH007', 'Bóng đèn LED 9W',        'Cái',        300, 100),
('HH008', 'Khóa cửa tay gạt',       'Bộ',          25, 15),
('HH009', 'Keo dán sắt Epoxy',      'Tuýp',        60, 30),
('HH010', 'Băng keo điện',           'Cuộn',       150, 50),
('HH011', 'Ốc vít M8x30',           'Hộp (100c)',  40, 20),
('HH012', 'Bản lề inox 3 inch',     'Cặp',         8, 20),
('HH013', 'Van nước Φ21',            'Cái',         12, 15),
('HH014', 'Cát xây dựng',            'Khối (m³)',   18, 10),
('HH015', 'Đá 1x2',                  'Khối (m³)',   22, 10);

-- ============================================
-- PHIẾU NHẬP KHO (8 phiếu, trải 3 tháng)
-- ============================================

-- Tháng 2/2026
INSERT INTO PhieuNhapKho (MaPhieu, NgayLap, TrangThai, GhiChu, nhan_vien_id, nha_cung_cap_id, nguoi_duyet_id, ngay_duyet) VALUES
('PNK001', '2026-02-05', 'DaDuyet', 'Nhập đầu tháng 2',     2, 1, 1, '2026-02-06'),
('PNK002', '2026-02-18', 'DaDuyet', 'Bổ sung vật tư ống nhựa',2, 3, 1, '2026-02-19'),
('PNK003', '2026-02-28', 'DaDuyet', 'Nhập cuối tháng 2',    3, 2, 1, '2026-02-28');

-- Tháng 3/2026
INSERT INTO PhieuNhapKho (MaPhieu, NgayLap, TrangThai, GhiChu, nhan_vien_id, nha_cung_cap_id, nguoi_duyet_id, ngay_duyet) VALUES
('PNK004', '2026-03-03', 'DaDuyet', 'Nhập đầu tháng 3',     2, 4, 1, '2026-03-04'),
('PNK005', '2026-03-15', 'DaDuyet', 'Đơn hàng lớn T3',      3, 1, 1, '2026-03-16'),
('PNK006', '2026-03-25', 'DaDuyet', 'Nhập bổ sung cuối T3',  2, 5, 1, '2026-03-26');

-- Tháng 4/2026
INSERT INTO PhieuNhapKho (MaPhieu, NgayLap, TrangThai, GhiChu, nhan_vien_id, nha_cung_cap_id) VALUES
('PNK007', '2026-04-02', 'ChoDuyet', 'Chờ duyệt đầu T4',    2, 2);

INSERT INTO PhieuNhapKho (MaPhieu, NgayLap, TrangThai, GhiChu, nhan_vien_id, nha_cung_cap_id, ly_do_tu_choi) VALUES
('PNK008', '2026-04-05', 'TuChoi', 'Sai đơn giá',           3, 3, 'Đơn giá không khớp hợp đồng');

-- ============================================
-- CHI TIẾT PHIẾU NHẬP KHO
-- ============================================
INSERT INTO ChiTietPhieuNhapKho (phieu_nhap_id, hang_hoa_id, SoLuong, DonGia) VALUES
-- PNK001: Xi măng, thép, gạch
(1, 1, 50, 95000),
(1, 2, 10, 850000),
(1, 3, 500, 1200),
-- PNK002: Ống nhựa, keo, van
(2, 5, 80, 25000),
(2, 9, 30, 45000),
(2, 13, 10, 35000),
-- PNK003: Sơn, dây điện, bóng đèn, khóa
(3, 4, 40, 320000),
(3, 6, 20, 185000),
(3, 7, 100, 22000),
(3, 8, 15, 280000),
-- PNK004: Ốc vít, bản lề
(4, 11, 20, 65000),
(4, 12, 15, 42000),
-- PNK005: Xi măng, cát, đá (đơn lớn)
(5, 1, 100, 93000),
(5, 14, 15, 250000),
(5, 15, 20, 280000),
(5, 3, 1000, 1150),
-- PNK006: Băng keo, ống nhựa, dây điện
(6, 10, 80, 15000),
(6, 5, 50, 24000),
(6, 6, 15, 190000),
-- PNK007 (ChoDuyet): Xi măng, sơn
(7, 1, 60, 96000),
(7, 4, 30, 325000),
-- PNK008 (TuChoi): Thép
(8, 2, 20, 900000);

-- ============================================
-- PHIẾU XUẤT KHO (4 phiếu)
-- ============================================
INSERT INTO PhieuXuatKho (MaPhieu, NgayLap, TrangThai, GhiChu, nhan_vien_id, nguoi_duyet_id, ngay_duyet) VALUES
('PXK001', '2026-02-10', 'DaDuyet', 'Xuất cho công trình A',  2, 1, '2026-02-10'),
('PXK002', '2026-03-08', 'DaDuyet', 'Xuất cho dự án B',       3, 1, '2026-03-09'),
('PXK003', '2026-03-20', 'DaDuyet', 'Xuất vật tư điện nước',  2, 1, '2026-03-21');

INSERT INTO PhieuXuatKho (MaPhieu, NgayLap, TrangThai, GhiChu, nhan_vien_id) VALUES
('PXK004', '2026-04-10', 'ChoDuyet', 'Chờ duyệt xuất T4',    3);

-- ============================================
-- CHI TIẾT PHIẾU XUẤT KHO
-- ============================================
INSERT INTO ChiTietPhieuXuatKho (phieu_xuat_id, hang_hoa_id, SoLuong, DonGia) VALUES
-- PXK001: Xi măng, gạch
(1, 1, 30, 95000),
(1, 3, 300, 1200),
-- PXK002: Thép, cát, đá
(2, 2, 5, 850000),
(2, 14, 8, 250000),
(2, 15, 10, 280000),
-- PXK003: Ống nhựa, dây điện, bóng đèn, van
(3, 5, 40, 25000),
(3, 6, 10, 185000),
(3, 7, 50, 22000),
(3, 13, 5, 35000),
-- PXK004 (ChoDuyet): Sơn, băng keo
(4, 4, 15, 320000),
(4, 10, 30, 15000);

-- ============================================
-- KIỂM KÊ (1 đợt hoàn thành)
-- ============================================
INSERT INTO PhieuKiemKe (MaKiemKe, NgayKiem, TrangThai, GhiChu, nhan_vien_id) VALUES
('KK001', '2026-03-31', 'HoanThanh', 'Kiểm kê cuối quý 1/2026', 2);

INSERT INTO ChiTietPhieuKiemKe (phieu_kiem_ke_id, hang_hoa_id, SoLuongThucTe, SoLuongSoSach) VALUES
(1, 1, 118, 120),
(1, 3, 2500, 2500),
(1, 5, 198, 200),
(1, 7, 298, 300),
(1, 10, 149, 150);
