const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET all check sheets
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*, s.shift_name, u.full_name as user_name
      FROM building_equipment_check c
      LEFT JOIN shifts s ON c.shift_id = s.id
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.reading_date DESC, c.shift_id ASC
      LIMIT 100
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Check Sheets Get Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create check sheet
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      reading_date,
      shift_id,
      water_level_status,
      motor_eq1_status,
      motor_eq2_status,
      motor_boster1_status,
      motor_boster2_status,
      buzzer_status,
      screen_status,
      exhaust_fan_status,
      pressure_air_status,
      chiller_dosing_status,
      water_level_dosing_status,
      floor_light_status,
      facade_light_status,
      swimming_light_status,
      light_b1_status,
      light_b2_status,
      stairs_a_status,
      stairs_b_status,
      radiator_status,
      jockey_pump_status,
      hydrant_pump_status,
      hydrant_diesel_status,
      sumpit1_status,
      sumpit2_status,
      sumpit3_status,
      sumpit4_status,
      panel_genset_status,
      elevator1_status,
      elevator2_status,
      elevator3_status,
      elevator4_status,
      elevator5_status,
      pompa_del_a_status,
      pompa_del_b_status,
      pompa_bos1a_status,
      pompa_bos2a_status,
      pompa_bos1b_status,
      pompa_bos2b_status,
      ground_tank_status,
      roof_tank_a_status,
      roof_tank_b_status,
      air_alarm_status,
      sound_system_status,
      access_control_status,
      cctv_status,
      easv_status,
      p_pabx_status,
      tv_cable_status,
      general_remarks
    } = req.body;

    // AMBIL user_id DARI TOKEN
    const user_id = req.user.id;

    console.log('Check Sheets Create - User ID from token:', user_id);

    const [result] = await db.query(`
      INSERT INTO building_equipment_check (
        reading_date,
        shift_id,
        user_id,
        water_level_status,
        motor_eq1_status,
        motor_eq2_status,
        motor_boster1_status,
        motor_boster2_status,
        buzzer_status,
        screen_status,
        exhaust_fan_status,
        pressure_air_status,
        chiller_dosing_status,
        water_level_dosing_status,
        floor_light_status,
        facade_light_status,
        swimming_light_status,
        light_b1_status,
        light_b2_status,
        stairs_a_status,
        stairs_b_status,
        radiator_status,
        jockey_pump_status,
        hydrant_pump_status,
        hydrant_diesel_status,
        sumpit1_status,
        sumpit2_status,
        sumpit3_status,
        sumpit4_status,
        panel_genset_status,
        elevator1_status,
        elevator2_status,
        elevator3_status,
        elevator4_status,
        elevator5_status,
        pompa_del_a_status,
        pompa_del_b_status,
        pompa_bos1a_status,
        pompa_bos2a_status,
        pompa_bos1b_status,
        pompa_bos2b_status,
        ground_tank_status,
        roof_tank_a_status,
        roof_tank_b_status,
        air_alarm_status,
        sound_system_status,
        access_control_status,
        cctv_status,
        easv_status,
        p_pabx_status,
        tv_cable_status,
        general_remarks
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      reading_date,
      shift_id || 1,
      user_id, // ← INI YANG PENTING!
      water_level_status || 'B',
      motor_eq1_status || 'B',
      motor_eq2_status || 'B',
      motor_boster1_status || 'B',
      motor_boster2_status || 'B',
      buzzer_status || 'B',
      screen_status || 'B',
      exhaust_fan_status || 'B',
      pressure_air_status || 'B',
      chiller_dosing_status || 'B',
      water_level_dosing_status || 'B',
      floor_light_status || 'B',
      facade_light_status || 'B',
      swimming_light_status || 'B',
      light_b1_status || 'B',
      light_b2_status || 'B',
      stairs_a_status || 'B',
      stairs_b_status || 'B',
      radiator_status || 'B',
      jockey_pump_status || 'B',
      hydrant_pump_status || 'B',
      hydrant_diesel_status || 'B',
      sumpit1_status || 'B',
      sumpit2_status || 'B',
      sumpit3_status || 'B',
      sumpit4_status || 'B',
      panel_genset_status || 'B',
      elevator1_status || 'B',
      elevator2_status || 'B',
      elevator3_status || 'B',
      elevator4_status || 'B',
      elevator5_status || 'B',
      pompa_del_a_status || 'B',
      pompa_del_b_status || 'B',
      pompa_bos1a_status || 'B',
      pompa_bos2a_status || 'B',
      pompa_bos1b_status || 'B',
      pompa_bos2b_status || 'B',
      ground_tank_status || 'B',
      roof_tank_a_status || 'B',
      roof_tank_b_status || 'B',
      air_alarm_status || 'B',
      sound_system_status || 'B',
      access_control_status || 'B',
      cctv_status || 'B',
      easv_status || 'B',
      p_pabx_status || 'B',
      tv_cable_status || 'B',
      general_remarks || ''
    ]);

    const [newSheet] = await db.query(
      'SELECT * FROM building_equipment_check WHERE id = ?',
      [result.insertId]
    );

    console.log('Check Sheet Created:', newSheet[0]);

    res.status(201).json({
      success: true,
      message: 'Check sheet created successfully',
      data: newSheet[0]
    });

  } catch (error) {
    console.error('Check Sheets Create Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE check sheet
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM building_equipment_check WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Check Sheets Delete Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;