const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('\n========== LOGIN REQUEST ==========');
    console.log('Username:', username);
    console.log('Password provided:', password ? 'YES' : 'NO');

    // Validasi input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username dan password wajib diisi'
      });
    }

    // Query database - PASTIKAN FORMAT BENAR
    console.log('\n🔍 Executing database query...');
    
    let queryResult;
    try {
      queryResult = await db.query(
        'SELECT id, username, password_hash, full_name, role, department FROM users WHERE username = ?',
        [username]
      );
    } catch (queryError) {
      console.error('❌ Database query failed:', queryError.message);
      return res.status(500).json({
        success: false,
        error: 'Database error: ' + queryError.message
      });
    }

    console.log('Query result type:', typeof queryResult);
    console.log('Query result isArray:', Array.isArray(queryResult));
    console.log('Query result length:', queryResult.length);
    console.log('Query result:', JSON.stringify(queryResult, null, 2));

    // Ekstrak rows dari hasil query
    // MySQL2 pool.query() returns [rows, fields]
    let rows;
    if (Array.isArray(queryResult)) {
      rows = queryResult[0]; // Ambil rows dari array [rows, fields]
    } else if (queryResult && Array.isArray(queryResult[0])) {
      rows = queryResult[0];
    } else {
      rows = queryResult;
    }

    console.log('\nExtracted rows:', rows);
    console.log('Rows type:', typeof rows);
    console.log('Rows isArray:', Array.isArray(rows));
    console.log('Rows length:', rows ? rows.length : 0);

    // Cek apakah ada user
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      console.log('❌ No user found with username:', username);
      return res.status(401).json({
        success: false,
        error: 'Username tidak ditemukan'
      });
    }

    // Ambil user pertama
    const user = rows[0];
    
    console.log('\n✅ User retrieved:');
    console.log('User:', user);
    console.log('User type:', typeof user);
    console.log('User keys:', user ? Object.keys(user) : 'NULL');

    // Validasi user object
    if (!user) {
      console.log('❌ User is null/undefined');
      return res.status(500).json({
        success: false,
        error: 'User data tidak valid'
      });
    }

    // Cek password_hash
    console.log('\n Checking password_hash...');
    console.log('password_hash exists:', user.password_hash ? 'YES' : 'NO');
    console.log('password_hash type:', typeof user.password_hash);
    console.log('password_hash value:', user.password_hash ? user.password_hash.substring(0, 30) + '...' : 'NULL');

    if (!user.password_hash) {
      console.log(' password_hash is missing!');
      console.log('Available user fields:', Object.keys(user));
      return res.status(500).json({
        success: false,
        error: 'Data user tidak lengkap - hubungi administrator'
      });
    }

    // Bandingkan password
    console.log('\n🔐 Comparing passwords...');
    let isValidPassword;
    try {
      isValidPassword = await bcrypt.compare(password, user.password_hash);
      console.log('Password match:', isValidPassword);
    } catch (bcryptError) {
      console.error('❌ bcrypt error:', bcryptError.message);
      return res.status(500).json({
        success: false,
        error: 'Password verification failed'
      });
    }

    if (!isValidPassword) {
      console.log(' Password salah');
      return res.status(401).json({
        success: false,
        error: 'Password salah'
      });
    }

    // Generate token
    console.log('\n🎫 Generating JWT token...');
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role || 'engineer',
      department: user.department || 'MEP'
    };

    const jwtSecret = process.env.JWT_SECRET || 'nirvana-development-secret-key-2026';
    
    const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: '24h' });
    console.log('✅ Token generated');

    // Response sukses
    const responseData = {
      success: true,
      message: 'Login berhasil',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name || user.username,
        role: user.role || 'engineer',
        department: user.department || 'MEP'
      }
    };

    console.log('\n📤 Sending response...');
    console.log(JSON.stringify(responseData, null, 2));
    console.log('===================================\n');

    return res.json(responseData);

  } catch (error) {
    console.error('\n💥 UNEXPECTED ERROR:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('===================================\n');
    
    return res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message
    });
  }
});

module.exports = router;