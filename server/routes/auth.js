const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, username, birthdate } = req.body;

  try {
    // 🟡 ตรวจสอบ email ซ้ำ
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // ✅ เข้ารหัสรหัสผ่าน
    const hashed = await bcrypt.hash(password, 10);

    // ✅ เพิ่มข้อมูลใหม่
    await pool.query(
      'INSERT INTO users (email, password, username, birthdate) VALUES ($1, $2, $3, $4)',
      [email, hashed, username, birthdate]
    );

    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error('❌ Register Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ ล็อกอิน
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ แก้ไขชื่อผู้ใช้
router.put('/:id', async (req, res) => {
  const { username } = req.body;

  try {
    await pool.query('UPDATE users SET username = $1 WHERE id = $2', [username, req.params.id]);
    res.json({ message: 'Username updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
