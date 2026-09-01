const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET all electrical logs
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, s.shift_name, u.full_name as user_name
      FROM electrical_log e
      LEFT JOIN shifts s ON e.shift_id = s.id
      LEFT JOIN users u ON e.user_id = u.id
      ORDER BY e.reading_date DESC, e.reading_time DESC
      LIMIT 100
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Electrical Log Get Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create electrical log
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      reading_date,
      reading_time,
      shift_id,
      daya_saat_ini,
      kwh_wbp,
      kwh_lwbp,
      total_kwh,
      kwh_kvarh,
      tag_phasa_r,
      tag_phasa_s,
      tag_phasa_t,
      arus_phasa_r,
      arus_phasa_s,
      arus_phasa_t,
      penalty,
      paraf,
      notes
    } = req.body;

    // AMBIL user_id DARI TOKEN
    const user_id = req.user.id;

    console.log('Electrical Log Create - User ID from token:', user_id);

    const [result] = await db.query(`
      INSERT INTO electrical_log (
        reading_date,
        reading_time,
        shift_id,
        user_id,
        daya_saat_ini,
        kwh_wbp,
        kwh_lwbp,
        total_kwh,
        kwh_kvarh,
        tag_phasa_r,
        tag_phasa_s,
        tag_phasa_t,
        arus_phasa_r,
        arus_phasa_s,
        arus_phasa_t,
        penalty,
        paraf,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      reading_date,
      reading_time,
      shift_id || 1,
      user_id, // ← INI YANG PENTING!
      daya_saat_ini || 0,
      kwh_wbp || 0,
      kwh_lwbp || 0,
      total_kwh || 0,
      kwh_kvarh || 0,
      tag_phasa_r || 0,
      tag_phasa_s || 0,
      tag_phasa_t || 0,
      arus_phasa_r || 0,
      arus_phasa_s || 0,
      arus_phasa_t || 0,
      penalty || 0,
      paraf || '',
      notes || ''
    ]);

    const [newLog] = await db.query(
      'SELECT * FROM electrical_log WHERE id = ?',
      [result.insertId]
    );

    console.log('Electrical Log Created:', newLog[0]);

    res.status(201).json({
      success: true,
      message: 'Electrical log created successfully',
      data: newLog[0]
    });

  } catch (error) {
    console.error('Electrical Log Create Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE electrical log
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM electrical_log WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Electrical Log Delete Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;