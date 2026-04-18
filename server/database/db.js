const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'warehouse.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');
const SEED_PATH = path.join(__dirname, 'seed.sql');

let db;

function getDb() {
  if (db) return db;

  const isNew = !fs.existsSync(DB_PATH);
  db = new Database(DB_PATH);

  // Enable WAL mode and foreign keys
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  if (isNew) {
    console.log('🔧 Tạo database mới...');
    initDatabase();
  } else {
    console.log('✅ Kết nối database sẵn có.');
  }

  return db;
}

function initDatabase() {
  // Run schema
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  db.exec(schema);
  console.log('📋 Schema: 11 bảng đã tạo');

  // Run seed with password hashing
  let seed = fs.readFileSync(SEED_PATH, 'utf-8');

  // Hash the default password "123456"
  const hash = bcrypt.hashSync('123456', 10);
  seed = seed.replace(/__HASH__/g, hash);

  db.exec(seed);
  console.log('🌱 Seed data: đã nạp dữ liệu mẫu');

  // Verify
  const tables = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
  ).all();
  console.log(`📊 Tổng cộng ${tables.length} bảng:`, tables.map(t => t.name).join(', '));

  const counts = {
    NhanVien: db.prepare('SELECT COUNT(*) as c FROM NhanVien').get().c,
    TaiKhoan: db.prepare('SELECT COUNT(*) as c FROM TaiKhoan').get().c,
    NhaCungCap: db.prepare('SELECT COUNT(*) as c FROM NhaCungCap').get().c,
    HangHoa: db.prepare('SELECT COUNT(*) as c FROM HangHoa').get().c,
    PhieuNhapKho: db.prepare('SELECT COUNT(*) as c FROM PhieuNhapKho').get().c,
    ChiTietPhieuNhapKho: db.prepare('SELECT COUNT(*) as c FROM ChiTietPhieuNhapKho').get().c,
    PhieuXuatKho: db.prepare('SELECT COUNT(*) as c FROM PhieuXuatKho').get().c,
    ChiTietPhieuXuatKho: db.prepare('SELECT COUNT(*) as c FROM ChiTietPhieuXuatKho').get().c,
    PhieuKiemKe: db.prepare('SELECT COUNT(*) as c FROM PhieuKiemKe').get().c,
    ChiTietPhieuKiemKe: db.prepare('SELECT COUNT(*) as c FROM ChiTietPhieuKiemKe').get().c,
    KetQuaDuBao: db.prepare('SELECT COUNT(*) as c FROM KetQuaDuBao').get().c,
  };
  console.log('📈 Dữ liệu mẫu:', counts);
}

// If run directly: node database/db.js
if (require.main === module) {
  // Delete existing DB to re-init
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
    console.log('🗑️  Xóa database cũ...');
  }
  getDb();
  console.log('\n✅ Database khởi tạo thành công!');
  process.exit(0);
}

module.exports = getDb;
