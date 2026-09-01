const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET all photo documentation
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, u.full_name as user_name
      FROM photo_documentation p
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.reading_date DESC, p.created_at DESC
      LIMIT 100
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Photo Documentation Get Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create photo documentation
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      reading_date,
      location,
      category,
      description,
      photo_url
    } = req.body;

    // AMBIL user_id DARI TOKEN
    const user_id = req.user.id;

    console.log('Photo Documentation Create - User ID from token:', user_id);

    const [result] = await db.query(`
      INSERT INTO photo_documentation (
        reading_date,
        location,
        category,
        description,
        photo_url,
        user_id
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      reading_date,
      location || '',
      category || 'General',
      description || '',
      photo_url || '',
      user_id // ← INI YANG PENTING!
    ]);

    const [newPhoto] = await db.query(
      'SELECT * FROM photo_documentation WHERE id = ?',
      [result.insertId]
    );

    console.log('Photo Documentation Created:', newPhoto[0]);

    res.status(201).json({
      success: true,
      message: 'Photo documentation created successfully',
      data: newPhoto[0]
    });

  } catch (error) {
    console.error('Photo Documentation Create Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE photo documentation
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM photo_documentation WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Photo Documentation Delete Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;