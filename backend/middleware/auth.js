const jwt = require('jsonwebtoken');
const db = require('../config/database');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('\n=== AUTH MIDDLEWARE ===');
    console.log('Auth header:', authHeader ? 'EXISTS' : 'MISSING');
    console.log('Token:', token ? token.substring(0, 30) + '...' : 'NULL');

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ 
        success: false,
        error: 'Access denied. No token provided.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'nirvana-development-secret-key-2026'
    );

    console.log('✅ Token decoded:', decoded);

    // Set req.user
    req.user = {
      id: decoded.userId || decoded.id,
      username: decoded.username,
      role: decoded.role || 'engineer'
    };

    console.log('✅ req.user set:', req.user);
    console.log('===================\n');

    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired. Please login again.' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        success: false,
        error: 'Invalid token.' 
      });
    }

    return res.status(500).json({ 
      success: false,
      error: 'Auth error: ' + error.message 
    });
  }
};

module.exports = { authenticateToken };