const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET all LVMDP readings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT l.*, s.shift_name, u.full_name as user_name
      FROM lvmdp_readings l
      LEFT JOIN shifts s ON l.shift_id = s.id
      LEFT JOIN users u ON l.user_id = u.id
      ORDER BY l.reading_date DESC, l.reading_time DESC
      LIMIT 100
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('LVMDP Get Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create LVMDP reading
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      reading_date,
      reading_time,
      shift_id,
      ampere_r,
      ampere_s,
      ampere_t,
      volt_rs,
      volt_st,
      volt_tr,
      cos_q,
      kw,
      kwh,
      hz,
      notes
    } = req.body;

    // AMBIL user_id DARI TOKEN (req.user)
    const user_id = req.user.id;

    console.log('LVMDP Create - User ID from token:', user_id);
    console.log('LVMDP Create - Data:', req.body);

    const [result] = await db.query(`
      INSERT INTO lvmdp_readings (
        reading_date,
        reading_time,
        shift_id,
        user_id,
        ampere_r,
        ampere_s,
        ampere_t,
        volt_rs,
        volt_st,
        volt_tr,
        cos_q,
        kw,
        kwh,
        hz,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      reading_date,
      reading_time,
      shift_id || 1,
      user_id, // ← INI YANG PENTING!
      ampere_r || 0,
      ampere_s || 0,
      ampere_t || 0,
      volt_rs || 0,
      volt_st || 0,
      volt_tr || 0,
      cos_q || 0,
      kw || 0,
      kwh || 0,
      hz || 50,
      notes || ''
    ]);

    const [newReading] = await db.query(
      'SELECT * FROM lvmdp_readings WHERE id = ?',
      [result.insertId]
    );

    console.log('LVMDP Created:', newReading[0]);

    res.status(201).json({
      success: true,
      message: 'LVMDP reading created successfully',
      data: newReading[0]
    });

  } catch (error) {
    console.error('LVMDP Create Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE LVMDP reading
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    console.log('🗑️ LVMDP Delete - ID:', req.params.id);
    
    await db.query('DELETE FROM lvmdp_readings WHERE id = ?', [req.params.id]);
    
    console.log('✅ LVMDP deleted successfully');
    
    res.json({ 
      success: true, 
      message: 'Data berhasil dihapus' 
    });
  } catch (error) {
    console.error('❌ LVMDP Delete Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;