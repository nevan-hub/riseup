/* ============================================
   RISEUP SECURITY — REPORTS ROUTES
   ============================================ */
'use strict';

const router  = require('express').Router();
const protect = require('../config/authMiddleware');

router.use(protect);

/* GET /api/reports — List user's reports (stub) */
router.get('/', async (req, res) => {
  // Stub: In production, pull from a Report model / cloud storage
  const reports = [
    { id: 'r1', title: 'March 2026 Incident Report',     category: 'Physical Security', date: '2026-04-01', type: 'pdf' },
    { id: 'r2', title: 'Q1 Threat Intelligence Summary', category: 'Cybersecurity',      date: '2026-04-01', type: 'pdf' },
    { id: 'r3', title: 'Firewall Audit — February 2026', category: 'Cybersecurity',      date: '2026-03-01', type: 'pdf' },
  ];
  res.json({ success: true, count: reports.length, reports });
});

/* GET /api/reports/:id/download — stub */
router.get('/:id/download', (req, res) => {
  res.status(200).json({ success: true, message: 'Report download will be available once backend storage is configured.' });
});

module.exports = router;
