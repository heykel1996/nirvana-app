const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET all check sheets
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('📊 Check Sheets GET - User:', req.user);
    
    const [rows] = await db.query(`
      SELECT c.*, s.shift_name, u.full_name as user_name
      FROM building_equipment_check c
      LEFT JOIN shifts s ON c.shift_id = s.id
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.reading_date DESC, c.shift_id ASC
      LIMIT 100
    `);
    
    console.log('✅ Check Sheets loaded:', rows.length, 'rows');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ Check Sheets GET Error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to load check sheets'
    });
  }
});

// POST create check sheet
router.post('/', authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    const user_id = req.user?.id || 1;

    console.log('📝 Check Sheets POST - User ID:', user_id);
    console.log('Shift ID:', data.shift_id);
    console.log('Data keys:', Object.keys(data));

    // Build dynamic INSERT based on shift_id
    let columns = ['reading_date', 'shift_id', 'user_id'];
    let values = [data.reading_date, data.shift_id || 1, user_id];
    let placeholders = ['?', '?', '?'];

    // Shift 1 fields
    if (data.shift_id == 1) {
      const shift1Fields = [
        'lvmdp_status', 'capacitor_bank_status', 'hvmdp_status',
        'transformer_temp', 'transformer_vol', 'temperatur_status',
        'volume_status', 'volume_solar_harian',
        'battery_charger_1', 'battery_24vdc_1',
        'volume_solar_utama', 'battery_charger_2', 'battery_24vdc_2',
        'catat_meter_pam', 'catat_meter_deep_well',
        'pompa_delivery_ab', 'pompa_boster_12a', 'pompa_boster_12b',
        'ground_tank', 'roof_tank_a', 'roof_tank_b'
      ];
      shift1Fields.forEach(field => {
        columns.push(field);
        values.push(data[field] || '-');
        placeholders.push('?');
      });
    }

    // Shift 2 fields
    if (data.shift_id == 2) {
      const shift2Fields = [
        'floor_ceiling_light', 'facade_light', 'swimming_light',
        'light_b1', 'light_b2', 'stairs_zone_a', 'stairs_zone_b',
        'radiator_water', 'battery_charger_s2', 'battery_24vdc_s2',
        'jockey_pump', 'hydrant_pump', 'hydrant_diesel',
        'sumpit_pump_1', 'sumpit_pump_2', 'sumpit_pump_3', 'sumpit_pump_4'
      ];
      shift2Fields.forEach(field => {
        columns.push(field);
        values.push(data[field] || '-');
        placeholders.push('?');
      });
    }

    // Shift 3 fields
    if (data.shift_id == 3) {
      const shift3Fields = [
        'panel_control_genset', 'battery_charger_s3', 'battery_24vdc_s3',
        'elevator_1', 'elevator_2', 'elevator_3', 'elevator_4', 'elevator_5',
        'pompa_delivery_ab_s3', 'pompa_boster_12a_s3', 'pompa_boster_12b_s3',
        'ground_tank_s3', 'roof_tank_a_s3', 'roof_tank_b_s3',
        'jocky_pompa_s3', 'hydrant_pompa_s3', 'hydrant_diesel_s3',
        'fire_alarm', 'sound_system', 'access_control', 'cctv',
        'bas_b', 'ip_pabx', 'tv_cable'
      ];
      shift3Fields.forEach(field => {
        columns.push(field);
        values.push(data[field] || '-');
        placeholders.push('?');
      });
    }

    // General shift fields (shift_id = 4)
    if (data.shift_id == 4) {
      const generalFields = [
        'water_level_07', 'motor_eq1_07', 'motor_eq2_07',
        'motor_boster1_07', 'motor_boster2_07', 'buzzer_07',
        'bar_screen_07', 'exhaust_fan_07', 'frlss_air_07',
        'chiller_dosing_07', 'water_level_dosing_07',
        'water_level_18', 'motor_eq1_18', 'motor_eq2_18',
        'motor_boster1_18', 'motor_boster2_18', 'buzzer_18',
        'bar_screen_18', 'exhaust_fan_18', 'frlss_air_18',
        'chiller_dosing_18', 'water_level_dosing_18'
      ];
      generalFields.forEach(field => {
        columns.push(field);
        values.push(data[field] || '-');
        placeholders.push('?');
      });
    }

    // Common fields
    if (data.general_remarks !== undefined) {
      columns.push('general_remarks');
      values.push(data.general_remarks || '');
      placeholders.push('?');
    }
    if (data.petugas !== undefined) {
      columns.push('petugas_general');
      values.push(data.petugas || '');
      placeholders.push('?');
    }

    const sql = `INSERT INTO building_equipment_check (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;
    
    console.log('SQL:', sql);
    console.log('Values:', values);

    const [result] = await db.query(sql, values);
    const [newSheet] = await db.query('SELECT * FROM building_equipment_check WHERE id = ?', [result.insertId]);

    console.log('✅ Check Sheet Created:', newSheet[0]);

    res.status(201).json({
      success: true,
      message: 'Check sheet saved successfully',
      data: newSheet[0]
    });

  } catch (error) {
    console.error('❌ Check Sheets POST Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to save check sheet'
    });
  }
});

// DELETE check sheet
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM building_equipment_check WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;