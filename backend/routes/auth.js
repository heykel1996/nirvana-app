const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// ==========================================
// POST /api/auth/login (Login User)
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari user berdasarkan username
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Username atau password salah' });
    }

    const user = users[0];

    // Verifikasi password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Username atau password salah' });
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
    console.error('Login Error:', error.message);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server', error: error.message });
  }
});

// ==========================================
// POST /api/auth/reset-password (RESET PASSWORD BARU)
// ==========================================
router.post('/reset-password', authenticateToken, async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const userId = req.user.id; // Diambil dari token JWT

    console.log(' Reset Password Request - User ID:', userId);

    // 1. Validasi Input
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

    // 2. Ambil Data User dari Database
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User tidak ditemukan' 
      });
    }

    const user = users[0];

    // 3. Verifikasi Password Lama
    const validPassword = await bcrypt.compare(old_password, user.password);
    
    if (!validPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password lama salah' 
      });
    }

    // 4. Hash Password Baru
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // 5. Update Password di Database
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    console.log('✅ Password berhasil direset untuk user:', user.username);

    res.json({ 
      success: true, 
      message: 'Password berhasil direset' 
    });

  } catch (error) {
    console.error(' Reset Password Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mereset password',
      error: error.message 
    });
  }
});

// ==========================================
// GET /api/auth/me (Get Current User Profile)
// ==========================================
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, username, full_name, role, department FROM users WHERE id = ?', [req.user.id]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    res.json({ success: true, data: users[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;