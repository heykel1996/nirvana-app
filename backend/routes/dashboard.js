const express = require("express");
const db = require("../config/database");
const { authenticateToken } = require("../middleware/auth.js");

const router = express.Router();

// GET /api/dashboard/summary
router.get("/summary", authenticateToken, async (req, res) => {
  try {
    // Get latest LVMDP reading (gunakan kolom 'kw' bukan 'load_kw')
    const lvmdpRows = await db.query(`
      SELECT kw, volt_rs, ampere_r, reading_date, reading_time
      FROM lvmdp_readings 
      ORDER BY reading_date DESC, reading_time DESC 
      LIMIT 1
    `);

    // Get water level today
    const waterRows = await db.query(`
      SELECT stand_meter, reservoir_fml 
      FROM water_log 
      WHERE reading_date = CURDATE()
      ORDER BY reading_time DESC
      LIMIT 1
    `);

    // Get total readings today
    const totalRows = await db.query(`
      SELECT COUNT(*) as total 
      FROM lvmdp_readings 
      WHERE reading_date = CURDATE()
    `);

    // Get photo count today
    const photoRows = await db.query(`
      SELECT COUNT(*) as total 
      FROM photo_documentation 
      WHERE DATE(created_at) = CURDATE()
    `);

    // Get recent LVMDP readings (5 terakhir)
    const recentReadings = await db.query(`
      SELECT l.reading_date, l.reading_time, l.kw, l.volt_rs, l.ampere_r,
             s.shift_name, u.full_name as user_name
      FROM lvmdp_readings l
      LEFT JOIN shifts s ON l.shift_id = s.id
      LEFT JOIN users u ON l.user_id = u.id
      ORDER BY l.reading_date DESC, l.reading_time DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        lvmdp: {
          load_kw: lvmdpRows[0]?.kw || 0,
          voltage: lvmdpRows[0]?.volt_rs || 0,
          current: lvmdpRows[0]?.ampere_r || 0,
        },
        water_level: waterRows[0]?.reservoir_fml || waterRows[0]?.stand_meter || 0,
        total_readings: totalRows[0]?.total || 0,
        photos_today: photoRows[0]?.total || 0,
        recent_readings: recentReadings || [],
      },
    });
  } catch (error) {
    console.error("[Dashboard] Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/dashboard/stats - Statistik tambahan
router.get("/stats", authenticateToken, async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM lvmdp_readings) as total_lvmdp,
        (SELECT COUNT(*) FROM stp_checklist) as total_stp,
        (SELECT COUNT(*) FROM water_log) as total_water,
        (SELECT COUNT(*) FROM genset_log) as total_genset,
        (SELECT COUNT(*) FROM electrical_log_pln) as total_electrical,
        (SELECT COUNT(*) FROM building_equipment_check) as total_check_sheets
    `);

    res.json({ success: true, data: stats[0] });
  } catch (error) {
    console.error("[Dashboard Stats] Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
