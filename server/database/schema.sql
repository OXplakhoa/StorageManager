-- ============================================================
-- HTTT Quản lý Kho hàng – Database Schema (SQLite)
-- ⚠️ YÊU CẦU: SQLite >= 3.31.0 (hỗ trợ GENERATED columns)
--    Kiểm tra: sqlite3 --version
--    macOS Sonoma+ / Node better-sqlite3 đều >= 3.31
-- ============================================================

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ============================================
-- 1. BẢNG NỀN TẢNG
-- ============================================

CREATE TABLE IF NOT EXISTS NhanVien (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    MaNV        TEXT UNIQUE NOT NULL,
    HoTen       TEXT NOT NULL,
    SDT         TEXT,
    DiaChi      TEXT,
    NgaySinh    TEXT,
    BoPhan      TEXT NOT NULL,
    created_at  TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS TaiKhoan (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    TenDangNhap   TEXT UNIQUE NOT NULL,
    MatKhau       TEXT NOT NULL,
    VaiTro        TEXT NOT NULL CHECK(VaiTro IN ('ThuKho','TruongKho','KeToan','BoPhanYC','BanGD')),
    TrangThai     TEXT DEFAULT 'HoatDong' CHECK(TrangThai IN ('HoatDong','Khoa')),
    nhan_vien_id  INTEGER UNIQUE,
    FOREIGN KEY (nhan_vien_id) REFERENCES NhanVien(id)
);

-- ============================================
-- 2. BẢNG DANH MỤC
-- ============================================

CREATE TABLE IF NOT EXISTS NhaCungCap (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    MaNCC       TEXT UNIQUE NOT NULL,
    TenNCC      TEXT NOT NULL,
    DiaChi      TEXT,
    SDT         TEXT,
    created_at  TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS HangHoa (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    MaHang          TEXT UNIQUE NOT NULL,
    TenHang         TEXT NOT NULL,
    DVT             TEXT NOT NULL,
    SoLuongTonKho   INTEGER DEFAULT 0,
    HanMucTonToiThieu INTEGER DEFAULT 10,
    created_at      TEXT DEFAULT (datetime('now'))
);

-- ============================================
-- 3. BẢNG PHIẾU NHẬP KHO + CHI TIẾT
-- ============================================

CREATE TABLE IF NOT EXISTS PhieuNhapKho (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    MaPhieu         TEXT UNIQUE NOT NULL,
    NgayLap         TEXT NOT NULL,
    TrangThai       TEXT DEFAULT 'ChoDuyet' CHECK(TrangThai IN ('ChoDuyet','DaDuyet','TuChoi')),
    GhiChu          TEXT,
    nhan_vien_id    INTEGER NOT NULL,
    nha_cung_cap_id INTEGER NOT NULL,
    nguoi_duyet_id  INTEGER,
    ngay_duyet      TEXT,
    ly_do_tu_choi   TEXT,
    FOREIGN KEY (nhan_vien_id) REFERENCES NhanVien(id),
    FOREIGN KEY (nha_cung_cap_id) REFERENCES NhaCungCap(id),
    FOREIGN KEY (nguoi_duyet_id) REFERENCES NhanVien(id)
);

-- ⚠️ ThanhTien dùng GENERATED ALWAYS AS → cần SQLite >= 3.31.0
CREATE TABLE IF NOT EXISTS ChiTietPhieuNhapKho (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    phieu_nhap_id   INTEGER NOT NULL,
    hang_hoa_id     INTEGER NOT NULL,
    SoLuong         INTEGER NOT NULL,
    DonGia          REAL NOT NULL,
    ThanhTien       REAL GENERATED ALWAYS AS (SoLuong * DonGia) STORED,
    FOREIGN KEY (phieu_nhap_id) REFERENCES PhieuNhapKho(id) ON DELETE CASCADE,
    FOREIGN KEY (hang_hoa_id) REFERENCES HangHoa(id)
);

-- ============================================
-- 4. BẢNG PHIẾU XUẤT KHO + CHI TIẾT
-- ============================================

CREATE TABLE IF NOT EXISTS PhieuXuatKho (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    MaPhieu         TEXT UNIQUE NOT NULL,
    NgayLap         TEXT NOT NULL,
    TrangThai       TEXT DEFAULT 'ChoDuyet' CHECK(TrangThai IN ('ChoDuyet','DaDuyet','TuChoi')),
    GhiChu          TEXT,
    nhan_vien_id    INTEGER NOT NULL,
    nguoi_duyet_id  INTEGER,
    ngay_duyet      TEXT,
    ly_do_tu_choi   TEXT,
    FOREIGN KEY (nhan_vien_id) REFERENCES NhanVien(id),
    FOREIGN KEY (nguoi_duyet_id) REFERENCES NhanVien(id)
);

CREATE TABLE IF NOT EXISTS ChiTietPhieuXuatKho (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    phieu_xuat_id   INTEGER NOT NULL,
    hang_hoa_id     INTEGER NOT NULL,
    SoLuong         INTEGER NOT NULL,
    DonGia          REAL NOT NULL,
    ThanhTien       REAL GENERATED ALWAYS AS (SoLuong * DonGia) STORED,
    FOREIGN KEY (phieu_xuat_id) REFERENCES PhieuXuatKho(id) ON DELETE CASCADE,
    FOREIGN KEY (hang_hoa_id) REFERENCES HangHoa(id)
);

-- ============================================
-- 5. BẢNG KIỂM KÊ + CHI TIẾT
-- ============================================

CREATE TABLE IF NOT EXISTS PhieuKiemKe (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    MaKiemKe      TEXT UNIQUE NOT NULL,
    NgayKiem      TEXT NOT NULL,
    TrangThai     TEXT DEFAULT 'DangKiem' CHECK(TrangThai IN ('DangKiem','HoanThanh')),
    GhiChu        TEXT,
    nhan_vien_id  INTEGER NOT NULL,
    FOREIGN KEY (nhan_vien_id) REFERENCES NhanVien(id)
);

CREATE TABLE IF NOT EXISTS ChiTietPhieuKiemKe (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    phieu_kiem_ke_id  INTEGER NOT NULL,
    hang_hoa_id       INTEGER NOT NULL,
    SoLuongThucTe     INTEGER NOT NULL,
    SoLuongSoSach     INTEGER NOT NULL,
    ChenhLech         INTEGER GENERATED ALWAYS AS (SoLuongThucTe - SoLuongSoSach) STORED,
    FOREIGN KEY (phieu_kiem_ke_id) REFERENCES PhieuKiemKe(id) ON DELETE CASCADE,
    FOREIGN KEY (hang_hoa_id) REFERENCES HangHoa(id)
);

-- ============================================
-- 6. BẢNG AI DỰ BÁO
-- ============================================

CREATE TABLE IF NOT EXISTS KetQuaDuBao (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    MaDuBao       TEXT UNIQUE NOT NULL,
    hang_hoa_id   INTEGER NOT NULL,
    DoChinhXac    REAL,
    NgayDuBao     TEXT NOT NULL,
    SoLuongDuBao  INTEGER NOT NULL,
    GhiChu        TEXT,
    FOREIGN KEY (hang_hoa_id) REFERENCES HangHoa(id)
);

-- ============================================
-- 7. PHIẾU ĐỀ NGHỊ XUẤT KHO (Bộ phận yêu cầu)
-- ============================================

CREATE TABLE IF NOT EXISTS PhieuDeNghiXuat (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    MaDeNghi        TEXT UNIQUE NOT NULL,
    NgayDeNghi      TEXT NOT NULL,
    LyDo            TEXT NOT NULL,
    TrangThai       TEXT DEFAULT 'ChoXuLy' CHECK(TrangThai IN ('ChoXuLy','DaTaoPhieu','TuChoi')),
    nhan_vien_id    INTEGER NOT NULL,
    hang_hoa_id     INTEGER NOT NULL,
    SoLuong         INTEGER NOT NULL,
    phieu_xuat_id   INTEGER,
    ly_do_tu_choi   TEXT,
    created_at      TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (nhan_vien_id) REFERENCES NhanVien(id),
    FOREIGN KEY (hang_hoa_id) REFERENCES HangHoa(id),
    FOREIGN KEY (phieu_xuat_id) REFERENCES PhieuXuatKho(id)
);

-- ============================================
-- 8. LỊCH SỬ BIẾN ĐỘNG TỒN KHO (Stock Ledger)
-- ============================================

CREATE TABLE IF NOT EXISTS LichSuTonKho (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    hang_hoa_id     INTEGER NOT NULL,
    NgayGhiNhan     TEXT NOT NULL DEFAULT (datetime('now')),
    LoaiBienDong    TEXT NOT NULL CHECK(LoaiBienDong IN ('Nhap','Xuat','KiemKe','KhoiTao')),
    SoLuongThayDoi  INTEGER NOT NULL,
    TonKhoSau       INTEGER NOT NULL,
    MaChungTu       TEXT,
    GhiChu          TEXT,
    FOREIGN KEY (hang_hoa_id) REFERENCES HangHoa(id)
);
