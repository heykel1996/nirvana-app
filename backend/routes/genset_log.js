const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET all genset logs
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('📊 Genset Log GET - User:', req.user);
    
    const [rows] = await db.query(`
      SELECT g.*, s.shift_name, u.full_name as user_name
      FROM genset_log g
      LEFT JOIN shifts s ON g.shift_id = s.id
      LEFT JOIN users u ON g.user_id = u.id
      ORDER BY g.reading_date DESC, g.reading_time DESC
      LIMIT 100
    `);
    
    console.log('✅ Genset Log loaded:', rows.length, 'rows');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ Genset Log GET Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to fetch genset logs'
    });
  }
});

// POST create genset log
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      reading_date, reading_time, shift_id,
      is_running, running_hours,
      daily_tank_volume, storage_tank_volume,
      battery_24vdc, battery_charger_status,
      engine_temperature, oil_pressure, ampere_accu,
      pipa_bahan_bakar_checked, filter_checked, visual_inspection,
      air_filter_connection, air_filter_pipe, air_filter_replace,
      air_filter_clean, mesin_bersih, kabel_accu_checked,
      notes
    } = req.body;

    const user_id = req.user?.id || 1;

    console.log('📝 Genset Log POST - User ID:', user_id);
    console.log('Data:', req.body);

    const [result] = await db.query(`
      INSERT INTO genset_log (
        reading_date, reading_time, shift_id, user_id,
        is_running, running_hours,
        daily_tank_volume, storage_tank_volume,
        battery_24vdc, battery_charger_status,
        engine_temperature, oil_pressure, ampere_accu,
        pipa_bahan_bakar_checked, filter_checked, visual_inspection,
        air_filter_connection, air_filter_pipe, air_filter_replace,
        air_filter_clean, mesin_bersih, kabel_accu_checked,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      reading_date, reading_time, shift_id || 1, user_id,
      is_running || 0, parseFloat(running_hours) || 0,
      parseFloat(daily_tank_volume) || 0, parseFloat(storage_tank_volume) || 0,
      parseFloat(battery_24vdc) || 0, battery_charger_status || 'OFF',
      parseFloat(engine_temperature) || 0, parseFloat(oil_pressure) || 0, parseFloat(ampere_accu) || 0,
      pipa_bahan_bakar_checked || 0, filter_checked || 0, visual_inspection || 0,
      air_filter_connection || 0, air_filter_pipe || 0, air_filter_replace || 0,
      air_filter_clean || 0, mesin_bersih || 0, kabel_accu_checked || 0,
      notes || ''
    ]);

    const [newLog] = await db.query('SELECT * FROM genset_log WHERE id = ?', [result.insertId]);

    console.log('✅ Genset Log Created:', newLog[0]);

    res.status(201).json({
      success: true,
      message: 'Genset log saved',
      data: newLog[0]
    });

  } catch (error) {
    console.error('❌ Genset Log POST Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to save genset log'
    });
  }
});

// DELETE genset log
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM genset_log WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;