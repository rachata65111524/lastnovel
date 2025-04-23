// server/routes/works.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../db');
const router = express.Router();

// กำหนดที่เก็บไฟล์
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// ✅ POST /api/works (สร้างผลงาน)
router.post('/', upload.single('cover_image'), async (req, res) => {
  const { title, type, user_id } = req.body; // ✅ รับ user_id
  const file = req.file;

  if (!title || !type || !file || !user_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const imageUrl = `http://10.0.2.2:5000/uploads/${file.filename}`;

  try {
    await pool.query(
      'INSERT INTO works (user_id, title, type, cover_image) VALUES ($1, $2, $3, $4)',
      [user_id, title, type, imageUrl] // ✅ ใช้ user_id ที่ส่งมาจริง
    );
    res.json({ message: 'Work created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ GET /api/works?type=novel หรือ comic
router.get('/', async (req, res) => {
  const { type } = req.query;
  if (!type || !['novel', 'comic'].includes(type)) {
    return res.status(400).json({ error: 'Invalid or missing type' });
  }

  try {
    const result = await pool.query(
      'SELECT id, title, type, cover_image FROM works WHERE type = $1 ORDER BY created_at DESC',
      [type]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch works' });
  }
});

// ✅ GET /api/works/user/:id → แสดงผลงานของผู้ใช้คนนั้น
router.get('/user/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(
      'SELECT id, title, type, cover_image FROM works WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching user works:', err);
    res.status(500).json({ error: 'Failed to fetch user works' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT id, title, type, user_id FROM works WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch work' });
  }
});



module.exports = router;
