/* ============================================
   RISEUP SECURITY — SERVICE MODEL
   ============================================ */
'use strict';

const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  user: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
    index:    true,
  },

  name: {
    type:     String,
    required: true,
    trim:     true,
  },

  category: {
    type: String,
    enum: ['physical', 'cyber', 'integrated'],
    required: true,
  },

  type: {
    type: String,
    enum: [
      'armed_guard', 'unarmed_guard', 'event_security',
      'vip_protection', 'mobile_patrol', 'access_control',
      'network_assessment', 'firewall_management', 'threat_monitoring',
      'data_protection', 'security_audit', 'incident_response',
    ],
    required: true,
  },

  status: {
    type:    String,
    enum:    ['active', 'pending', 'paused', 'cancelled'],
    default: 'pending',
  },

  startDate: {
    type: Date,
    default: Date.now,
  },

  endDate: Date,

  billing: {
    type:   String,
    enum:   ['monthly', 'once_off', 'daily'],
    default: 'monthly',
  },

  amount: {
    type: Number,
    min:  0,
  },

  details: {
    type: String, // Extra notes, SLA details, location, etc.
    default: '',
  },

  alerts: [{
    message:   String,
    severity:  { type: String, enum: ['info', 'warning', 'critical'], default: 'info' },
    resolved:  { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  }],

}, {
  timestamps: true,
});

module.exports = mongoose.model('Service', ServiceSchema);
