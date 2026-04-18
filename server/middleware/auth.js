const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'kho-hang-minh-phat-secret-2026';

// Verify JWT token
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Chưa đăng nhập' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

// Role-based access control – điểm phân quyền quan trọng nhất
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.VaiTro)) {
    return res.status(403).json({ error: 'Không có quyền thực hiện thao tác này' });
  }
  next();
};

module.exports = { authenticate, requireRole, JWT_SECRET };
