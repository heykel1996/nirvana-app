const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET all shift handovers
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('📊 Shift Handover GET - User:', req.user);
    
    const [rows] = await db.query(`
      SELECT h.*, s1.shift_name as from_shift_name, s2.shift_name as to_shift_name, u.full_name as user_name
      FROM shift_handover h
      LEFT JOIN shifts s1 ON h.from_shift_id = s1.id
      LEFT JOIN shifts s2 ON h.to_shift_id = s2.id
      LEFT JOIN users u ON h.user_id = u.id
      ORDER BY h.handover_date DESC, h.from_shift_id ASC
      LIMIT 100
    `);
    
    console.log('✅ Shift Handover loaded:', rows.length, 'rows');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(' Shift Handover GET Error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to load shift handover'
    });
  }
});

// POST create shift handover
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      handover_date, from_shift_id, to_shift_id,
      from_user, to_user,
      completed_tasks, pending_tasks, issues, notes
    } = req.body;

    const user_id = req.user?.id || 1;

    console.log('📝 Shift Handover POST - User ID:', user_id);
    console.log('Data:', req.body);

    const [result] = await db.query(`
      INSERT INTO shift_handover (
        handover_date, from_shift_id, to_shift_id,
        from_user, to_user,
        completed_tasks, pending_tasks, issues, notes, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      handover_date, from_shift_id || 1, to_shift_id || 2,
      from_user || '', to_user || '',
      completed_tasks || '', pending_tasks || '', issues || '', notes || '', user_id
    ]);

    const [newHandover] = await db.query('SELECT * FROM shift_handover WHERE id = ?', [result.insertId]);

    console.log('✅ Shift Handover Created:', newHandover[0]);

    res.status(201).json({
      success: true,
      message: 'Shift handover saved',
      data: newHandover[0]
    });

  } catch (error) {
    console.error('❌ Shift Handover POST Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to save shift handover'
    });
  }
});

// DELETE shift handover
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM shift_handover WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;