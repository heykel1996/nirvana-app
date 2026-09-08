const express = require('express');
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware untuk verifikasi token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nirvana-development-secret-key-2026');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Token tidak valid' });
  }
};

// ==========================================
// POST /api/auth/login
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('🔐 Login attempt for:', username);

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username dan password harus diisi' 
      });
    }

    // Cari user berdasarkan username
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (users.length === 0) {
      console.log('❌ User not found:', username);
      return res.status(401).json({ 
        success: false, 
        message: 'Username atau password salah' 
      });
    }

    const user = users[0];

    // Verifikasi password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('❌ Invalid password for:', username);
      return res.status(401).json({ 
        success: false, 
        message: 'Username atau password salah' 
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        department: user.department,
        full_name: user.full_name
      },
      process.env.JWT_SECRET || 'nirvana-development-secret-key-2026',
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful for:', username);

    res.json({
      success: true,
      message: 'Login berhasil',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
        department: user.department
      }
    });

  } catch (error) {
    console.error('❌ Login Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan server',
      error: error.message 
    });
  }
});

// ==========================================
// POST /api/auth/reset-password
// ==========================================
router.post('/reset-password', authenticateToken, async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const userId = req.user.id;

    console.log('🔑 Reset Password Request - User ID:', userId);

    if (!old_password || !new_password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password lama dan password baru harus diisi' 
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password baru minimal 6 karakter' 
      });
    }

    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User tidak ditemukan' 
      });
    }

    const user = users[0];

    const validPassword = await bcrypt.compare(old_password, user.password);
    
    if (!validPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password lama salah' 
      });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    console.log('✅ Password berhasil direset untuk user:', user.username);

    res.json({ 
      success: true, 
      message: 'Password berhasil direset' 
    });

  } catch (error) {
    console.error('❌ Reset Password Error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mereset password',
      error: error.message 
    });
  }
});

// ==========================================
// GET /api/auth/me
// ==========================================
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, full_name, role, department FROM users WHERE id = ?', 
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    res.json({ success: true, data: users[0] });
  } catch (error) {
    console.error('❌ Get User Error:', error.message);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;