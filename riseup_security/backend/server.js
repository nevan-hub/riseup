/* ============================================
   RISEUP SECURITY — EXPRESS SERVER
   ============================================ */
'use strict';

require('dotenv').config();

const express    = require('express');
const mongoose   = require('mongoose');
const helmet     = require('helmet');
const cors       = require('cors');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const path       = require('path');

const authRoutes      = require('./routes/auth');
const userRoutes      = require('./routes/users');
const serviceRoutes   = require('./routes/services');
const reportRoutes    = require('./routes/reports');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── Security Middleware ── */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      styleSrc:    ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc:     ["'self'", "fonts.gstatic.com"],
      imgSrc:      ["'self'", "data:", "blob:"],
      connectSrc:  ["'self'"],
    },
  },
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

/* ── Rate Limiting ── */
const apiLimiter = rateLimit({
  windowMs:        15 * 60 * 1000, // 15 minutes
  max:             100,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { success: false, message: 'Too many requests. Please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  message:  { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
});

/* ── General Middleware ── */
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

/* ── Static Files (frontend) ── */
app.use(express.static(path.join(__dirname, '..')));
app.use('/components', express.static(path.join(__dirname, '../components')));

/* ── API Routes ── */
app.use('/api', apiLimiter);
app.use('/api/auth',     authLimiter, authRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reports',  reportRoutes);

/* ── Health Check ── */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status:  'operational',
    uptime:  process.uptime(),
    time:    new Date().toISOString(),
  });
});

/* ── SPA Fallback ── */
app.get('*', (req, res) => {
  // Serve index.html for non-API, non-asset routes
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../index.html'));
  } else {
    res.status(404).json({ success: false, message: 'Endpoint not found.' });
  }
});

/* ── Global Error Handler ── */
app.use((err, req, res, next) => {
  const status  = err.status  || 500;
  const message = err.message || 'An unexpected error occurred.';
  console.error(`[RiseUp Error] ${status} — ${message}`);
  if (process.env.NODE_ENV === 'development') console.error(err.stack);
  res.status(status).json({ success: false, message });
});

/* ── Database & Server Start ── */
async function start() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/riseup_security';

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('[RiseUp] ✓ MongoDB connected:', MONGO_URI);
  } catch (err) {
    console.warn('[RiseUp] ⚠ MongoDB not connected — running without database.');
    console.warn('  Set MONGO_URI in .env to enable persistent storage.');
  }

  app.listen(PORT, () => {
    console.log(`\n[RiseUp] ✓ Server running on http://localhost:${PORT}`);
    console.log(`[RiseUp]   Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
}

start();

module.exports = app;
