const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET all shift handovers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT h.*, 
             u1.full_name as from_user_name,
             u2.full_name as to_user_name,
             s1.shift_name as from_shift_name,
             s2.shift_name as to_shift_name
      FROM shift_handover h
      LEFT JOIN users u1 ON h.from_user_id = u1.id
      LEFT JOIN users u2 ON h.to_user_id = u2.id
      LEFT JOIN shifts s1 ON h.from_shift_id = s1.id
      LEFT JOIN shifts s2 ON h.to_shift_id = s2.id
      ORDER BY h.handover_date DESC, h.created_at DESC
      LIMIT 100
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Shift Handover Get Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create shift handover
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      handover_date,
      from_shift_id,
      to_shift_id,
      from_user,
      to_user,
      completed_tasks,
      pending_tasks,
      issues,
      notes
    } = req.body;

    // AMBIL user_id DARI TOKEN
    const user_id = req.user.id;

    console.log('Shift Handover Create - User ID from token:', user_id);

    const [result] = await db.query(`
      INSERT INTO shift_handover (
        handover_date,
        from_shift_id,
        to_shift_id,
        from_user_id,
        to_user_id,
        completed_tasks,
        pending_tasks,
        issues,
        notes,
        user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      handover_date,
      from_shift_id || 1,
      to_shift_id || 2,
      user_id, // from_user_id
      user_id, // to_user_id (bisa diganti nanti)
      completed_tasks || '',
      pending_tasks || '',
      issues || '',
      notes || '',
      user_id // ← INI YANG PENTING!
    ]);

    const [newHandover] = await db.query(
      'SELECT * FROM shift_handover WHERE id = ?',
      [result.insertId]
    );

    console.log('Shift Handover Created:', newHandover[0]);

    res.status(201).json({
      success: true,
      message: 'Shift handover created successfully',
      data: newHandover[0]
    });

  } catch (error) {
    console.error('Shift Handover Create Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE shift handover
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM shift_handover WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Shift Handover Delete Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;