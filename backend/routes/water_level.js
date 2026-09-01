const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET all water logs
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT w.*, s.shift_name, u.full_name as user_name
      FROM water_log w
      LEFT JOIN shifts s ON w.shift_id = s.id
      LEFT JOIN users u ON w.user_id = u.id
      ORDER BY w.reading_date DESC, w.reading_time DESC
      LIMIT 100
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Water Log Get Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create water log
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      reading_date,
      reading_time,
      shift_id,
      stand_meter,
      reservoir_1,
      reservoir_2,
      reservoir_3,
      boster_timur,
      boster_barat,
      transfer_timur,
      transfer_barat,
      notes
    } = req.body;

    // AMBIL user_id DARI TOKEN
    const user_id = req.user.id;

    console.log('Water Log Create - User ID from token:', user_id);

    const [result] = await db.query(`
      INSERT INTO water_log (
        reading_date,
        reading_time,
        shift_id,
        user_id,
        stand_meter,
        reservoir_1,
        reservoir_2,
        reservoir_3,
        boster_timur,
        boster_barat,
        transfer_timur,
        transfer_barat,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      reading_date,
      reading_time,
      shift_id || 1,
      user_id, // ← INI YANG PENTING!
      stand_meter || 0,
      reservoir_1 || 'M',
      reservoir_2 || 'M',
      reservoir_3 || 'M',
      boster_timur || 0,
      boster_barat || 0,
      transfer_timur || 0,
      transfer_barat || 0,
      notes || ''
    ]);

    const [newLog] = await db.query(
      'SELECT * FROM water_log WHERE id = ?',
      [result.insertId]
    );

    console.log('Water Log Created:', newLog[0]);

    res.status(201).json({
      success: true,
      message: 'Water log created successfully',
      data: newLog[0]
    });

  } catch (error) {
    console.error('Water Log Create Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE water log
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM water_log WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Water Log Delete Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;