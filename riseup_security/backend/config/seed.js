/* ============================================
   RISEUP SECURITY — DB SEED
   Creates a demo admin + demo client
   Run: npm run seed
   ============================================ */
'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('../models/User');
const Service  = require('../models/Service');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/riseup_security';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('[Seed] Connected to MongoDB');

  // Clear existing
  await User.deleteMany({});
  await Service.deleteMany({});
  console.log('[Seed] Cleared existing data');

  // Create demo client
  const client = await User.create({
    name:     'Demo Client',
    email:    'demo@riseupsecurity.co.za',
    password: 'demo1234',
    company:  'Demo Enterprises (Pty) Ltd',
    phone:    '+27 010 000 0001',
    role:     'client',
  });

  // Create admin
  await User.create({
    name:     'RiseUp Admin',
    email:    'admin@riseupsecurity.co.za',
    password: process.env.ADMIN_PASSWORD || 'Admin@RiseUp2026!',
    role:     'admin',
  });

  // Create demo services
  await Service.create([
    {
      user:      client._id,
      name:      'Armed Guard Deployment',
      category:  'physical',
      type:      'armed_guard',
      status:    'active',
      billing:   'monthly',
      amount:    14500,
      details:   'Sandton Office Park — 2 guards on rotating shift.',
    },
    {
      user:      client._id,
      name:      '24/7 Threat Monitoring',
      category:  'cyber',
      type:      'threat_monitoring',
      status:    'active',
      billing:   'monthly',
      amount:    7800,
      details:   'SIEM monitoring with 15-minute alert escalation SLA.',
    },
    {
      user:      client._id,
      name:      'Quarterly Security Audit',
      category:  'cyber',
      type:      'security_audit',
      status:    'pending',
      billing:   'once_off',
      amount:    8500,
      details:   'Next review scheduled: May 2026.',
    },
  ]);

  console.log('[Seed] ✓ Demo data created');
  console.log('  Client:  demo@riseupsecurity.co.za / demo1234');
  console.log('  Admin:   admin@riseupsecurity.co.za / (see ADMIN_PASSWORD in .env)');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('[Seed] Error:', err.message);
  process.exit(1);
});
