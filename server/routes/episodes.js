const express = require('express');
const pool = require('../db');
const router = express.Router();

// ✅ POST /api/episodes → เพิ่มตอน (เฉพาะเจ้าของเท่านั้น)
router.post('/', async (req, res) => {
  const { work_id, title, content, images, user_id } = req.body;

  if (!work_id || !title || !user_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 🔒 ตรวจสอบว่า user_id เป็นเจ้าของงานจริงหรือไม่
    const ownerCheck = await pool.query('SELECT user_id FROM works WHERE id = $1', [work_id]);
    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Work not found' });
    }

    if (ownerCheck.rows[0].user_id !== parseInt(user_id)) {
      return res.status(403).json({ error: 'Unauthorized to add episode to this work' });
    }

    // ✅ บันทึก episode
    await pool.query(
      'INSERT INTO episodes (work_id, title, content, images) VALUES ($1, $2, $3, $4)',
      [work_id, title, content || null, images || null]
    );

    res.json({ message: 'Episode created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ ดึงตอนทั้งหมดของผลงานตาม work_id
router.get('/work/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT id, title, content, images, created_at FROM episodes WHERE work_id = $1 ORDER BY created_at DESC',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch episodes' });
  }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM episodes WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Episode not found' });
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch episode' });
    }
  });
  

module.exports = router;
