require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// ✅ สร้างแอปก่อนใช้
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const workRoutes = require('./routes/works');
app.use('/api/works', workRoutes);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

const episodeRoutes = require('./routes/episodes');
app.use('/api/episodes', episodeRoutes);
