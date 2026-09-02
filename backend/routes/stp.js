const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET all STP checklists
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('📊 STP GET - User:', req.user);
    
    const [rows] = await db.query(`
      SELECT s.*, s2.shift_name, u.full_name as user_name
      FROM stp_checklist s
      LEFT JOIN shifts s2 ON s.shift_id = s2.id
      LEFT JOIN users u ON s.user_id = u.id
      ORDER BY s.reading_date DESC, s.period DESC
      LIMIT 100
    `);
    
    console.log('✅ STP loaded:', rows.length, 'rows');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ STP GET Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to load STP data'
    });
  }
});

// POST create STP checklist
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      reading_date, period, shift_id,
      grit_chamber_status, grit_chamber_notes,
      equalizing_tank_status, equalizing_tank_notes,
      aeration_status, aeration_notes,
      sedimentation_tank_status, sedimentation_tank_notes,
      effluent_tank_status, effluent_tank_notes,
      pump_blower_status, pump_blower_notes,
      flow_meter_reading, general_notes
    } = req.body;

    const user_id = req.user?.id || 1;

    console.log('📝 STP POST - User ID:', user_id);
    console.log('Data:', req.body);

    const [result] = await db.query(`
      INSERT INTO stp_checklist (
        reading_date, period, shift_id, user_id,
        grit_chamber_status, grit_chamber_notes,
        equalizing_tank_status, equalizing_tank_notes,
        aeration_status, aeration_notes,
        sedimentation_tank_status, sedimentation_tank_notes,
        effluent_tank_status, effluent_tank_notes,
        pump_blower_status, pump_blower_notes,
        flow_meter_reading, general_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      reading_date, period || '09.00', shift_id || 1, user_id,
      grit_chamber_status || 'OK', grit_chamber_notes || '',
      equalizing_tank_status || 'OK', equalizing_tank_notes || '',
      aeration_status || 'OK', aeration_notes || '',
      sedimentation_tank_status || 'OK', sedimentation_tank_notes || '',
      effluent_tank_status || 'OK', effluent_tank_notes || '',
      pump_blower_status || 'OK', pump_blower_notes || '',
      parseFloat(flow_meter_reading) || 0, general_notes || ''
    ]);

    const [newChecklist] = await db.query('SELECT * FROM stp_checklist WHERE id = ?', [result.insertId]);

    console.log('✅ STP Created:', newChecklist[0]);

    res.status(201).json({
      success: true,
      message: 'STP checklist saved',
      data: newChecklist[0]
    });

  } catch (error) {
    console.error('❌ STP POST Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to save STP checklist'
    });
  }
});

// DELETE STP checklist
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM stp_checklist WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;