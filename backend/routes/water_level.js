const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET all water logs
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('📊 Water Log GET - User:', req.user);
    
    const [rows] = await db.query(`
      SELECT w.*, s.shift_name, u.full_name as user_name
      FROM water_log w
      LEFT JOIN shifts s ON w.shift_id = s.id
      LEFT JOIN users u ON w.user_id = u.id
      ORDER BY w.reading_date DESC, w.reading_time DESC
      LIMIT 100
    `);
    
    console.log('✅ Water Log loaded:', rows.length, 'rows');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ Water Log GET Error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to load water log'
    });
  }
});

// POST create water log
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      reading_date, reading_time, shift_id,
      stand_meter, reservoir_1, reservoir_2, reservoir_3,
      boster_timur, boster_barat,
      transfer_timur, transfer_barat,
      notes
    } = req.body;

    const user_id = req.user?.id || 1;

    console.log(' Water Log POST - Data:', req.body);

    const safeFloat = (val) => {
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    };

    const [result] = await db.query(`
      INSERT INTO water_log (
        reading_date, reading_time, shift_id, user_id,
        stand_meter, reservoir_1, reservoir_2, reservoir_3,
        boster_timur, boster_barat,
        transfer_timur, transfer_barat,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      reading_date, reading_time, parseInt(shift_id) || 1, user_id,
      safeFloat(stand_meter),
      reservoir_1 || null, reservoir_2 || null, reservoir_3 || null,
      safeFloat(boster_timur), safeFloat(boster_barat),
      safeFloat(transfer_timur), safeFloat(transfer_barat),
      notes || ''
    ]);

    const [newLog] = await db.query('SELECT * FROM water_log WHERE id = ?', [result.insertId]);

    console.log('✅ Water Log Created:', newLog[0]);

    res.status(201).json({
      success: true,
      message: 'Water log created successfully',
      data: newLog[0]
    });

  } catch (error) {
    console.error(' Water Log POST Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to save water log'
    });
  }
});

// DELETE water log
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM water_log WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;