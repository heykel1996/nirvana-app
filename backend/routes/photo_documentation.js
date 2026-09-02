const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET all photo documentation
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('📊 Photo Documentation GET - User:', req.user);
    
    const [rows] = await db.query(`
      SELECT p.*, u.full_name as user_name
      FROM photo_documentation p
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.reading_date DESC, p.created_at DESC
      LIMIT 100
    `);
    
    console.log('✅ Photo Documentation loaded:', rows.length, 'rows');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ Photo Documentation GET Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to load photo documentation'
    });
  }
});

// POST create photo documentation
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { reading_date, location, category, description, photo_url } = req.body;
    const user_id = req.user?.id || 1;

    console.log('📝 Photo Documentation POST - User ID:', user_id);
    console.log('Data:', req.body);

    const [result] = await db.query(`
      INSERT INTO photo_documentation (reading_date, location, category, description, photo_url, user_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [reading_date, location || '', category || 'General', description || '', photo_url || '', user_id]);

    const [newPhoto] = await db.query('SELECT * FROM photo_documentation WHERE id = ?', [result.insertId]);

    console.log('✅ Photo Created:', newPhoto[0]);

    res.status(201).json({ 
      success: true, 
      message: 'Photo uploaded successfully', 
      data: newPhoto[0] 
    });
  } catch (error) {
    console.error('❌ Photo Documentation POST Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to upload photo'
    });
  }
});

// DELETE photo documentation
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM photo_documentation WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;