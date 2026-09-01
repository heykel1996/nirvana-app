require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// CORS Configuration - TANPA wildcard
app.use(cors({
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body Parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Database Connection
const db = require('./config/database');

// Health Check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Nirvana MEP API is running',
    status: 'ok'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// Load Routes dengan try-catch
const routes = [
  { path: '/api/auth', file: './routes/auth' },
  { path: '/api/lvmdp', file: './routes/lvmdp' },
  { path: '/api/stp', file: './routes/stp' },
  { path: '/api/water-level', file: './routes/water_level' },
  { path: '/api/genset-log', file: './routes/genset_log' },
  { path: '/api/elektrikal', file: './routes/elektrikal' },
  { path: '/api/check-sheets', file: './routes/check_sheets' },
  { path: '/api/photo-documentation', file: './routes/photo_documentation' },
  { path: '/api/shift-handover', file: './routes/shift_handover' }
];

routes.forEach(route => {
  try {
    const router = require(route.file);
    app.use(route.path, router);
    console.log(`✅ ${route.path} loaded`);
  } catch (error) {
    console.error(`❌ ${route.path} error: ${error.message}`);
  }
});

// 404 Handler - TANPA wildcard
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('========================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
  console.log(`🏥 http://localhost:${PORT}/api/health`);
  console.log('========================================');
});