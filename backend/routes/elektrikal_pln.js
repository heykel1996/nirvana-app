const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth.js');

const router = express.Router();

// GET /api/elektrikal-pln - Get all logs
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [logs] = await db.query(`
      SELECT e.*, s.shift_name, u.full_name as user_name
      FROM electrical_log_pln e
      LEFT JOIN shifts s ON e.shift_id = s.id
      LEFT JOIN users u ON e.user_id = u.id
      ORDER BY e.reading_date DESC, e.reading_time DESC LIMIT 100
    `);
    res.json({ success: true, data: logs });
  } catch (error) {
    console.error('[Electrical Log] Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/elektrikal-pln/:id - Get by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [logs] = await db.query(
      'SELECT * FROM electrical_log_pln WHERE id = ?',
      [req.params.id]
    );
    if (logs.length === 0) {
      return res.status(404).json({ success: false, error: 'Log not found' });
    }
    res.json({ success: true, data: logs[0] });
  } catch (error) {
    console.error('[Electrical Log] Get by ID error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/elektrikal-pln - Create new log
router.post('/', authenticateToken, async (req, res) => {
  const {
    reading_date, reading_time, shift_id, user_id, petugas,
    // Meter Listrik PLN
    lvmdp_reading, capacitor_bank_reading, hvmdp_reading,
    transformer_temp, transformer_vol,
    // Solar & Battery
    volume_solar_harian, volume_solar_utama,
    battery_charger_status, battery_24vdc,
    // Water Meter
    meter_pam, meter_deep_well,
    // Pumps
    pompa_delivery_a, pompa_delivery_b,
    pompa_boster_1a, pompa_boster_2a,
    pompa_boster_1b, pompa_boster_2b,
    // Tank Levels
    ground_tank_level, roof_tank_a_level, roof_tank_b_level,
    notes
  } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO electrical_log_pln (
        reading_date, reading_time, shift_id, user_id, petugas,
        lvmdp_reading, capacitor_bank_reading, hvmdp_reading,
        transformer_temp, transformer_vol,
        volume_solar_harian, volume_solar_utama,
        battery_charger_status, battery_24vdc,
        meter_pam, meter_deep_well,
        pompa_delivery_a, pompa_delivery_b,
        pompa_boster_1a, pompa_boster_2a,
        pompa_boster_1b, pompa_boster_2b,
        ground_tank_level, roof_tank_a_level, roof_tank_b_level,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      reading_date, reading_time, shift_id || 1, user_id || req.user.id, petugas,
      lvmdp_reading, capacitor_bank_reading, hvmdp_reading,
      transformer_temp, transformer_vol,
      volume_solar_harian, volume_solar_utama,
      battery_charger_status, battery_24vdc,
      meter_pam, meter_deep_well,
      pompa_delivery_a, pompa_delivery_b,
      pompa_boster_1a, pompa_boster_2a,
      pompa_boster_1b, pompa_boster_2b,
      ground_tank_level, roof_tank_a_level, roof_tank_b_level,
      notes || ''
    ]);

    const [newLog] = await db.query(
      'SELECT * FROM electrical_log_pln WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ 
      success: true, 
      data: newLog[0],
      message: 'Electrical log created successfully' 
    });
  } catch (error) {
    console.error('[Electrical Log] Create error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/elektrikal-pln/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM electrical_log_pln WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;