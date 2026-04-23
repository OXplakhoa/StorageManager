require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/hanghoa', require('./routes/hanghoa'));
app.use('/api/nhacungcap', require('./routes/nhacungcap'));
app.use('/api/phieunhap', require('./routes/phieunhap'));
app.use('/api/phieuxuat', require('./routes/phieuxuat'));
app.use('/api/kiemke', require('./routes/kiemke'));
app.use('/api/baocao', require('./routes/baocao'));
app.use('/api/dubao', require('./routes/dubao'));
app.use('/api/denghi', require('./routes/denghi'));
app.use('/api/lichsu-tonkho', require('./routes/lichsu-tonkho'));

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ error: 'Lỗi hệ thống' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
  console.log(`📦 Hàng hóa:  http://localhost:${PORT}/api/hanghoa`);
  console.log(`🔐 Đăng nhập: POST http://localhost:${PORT}/api/auth/login\n`);
});
