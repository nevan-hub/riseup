/* ============================================
   RISEUP SECURITY — USER MODEL
   ============================================ */
'use strict';

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: [true, 'Full name is required.'],
    trim:     true,
    minlength: [2, 'Name must be at least 2 characters.'],
    maxlength: [80, 'Name must not exceed 80 characters.'],
  },

  email: {
    type:     String,
    required: [true, 'Email address is required.'],
    unique:   true,
    lowercase: true,
    trim:     true,
    validate: {
      validator: validator.isEmail,
      message:   'Please provide a valid email address.',
    },
  },

  password: {
    type:     String,
    required: [true, 'Password is required.'],
    minlength: [8, 'Password must be at least 8 characters.'],
    select:   false, // Never return password in queries by default
  },

  phone: {
    type:  String,
    trim:  true,
    default: '',
  },

  company: {
    type:  String,
    trim:  true,
    default: '',
  },

  role: {
    type:    String,
    enum:    ['client', 'admin', 'operator'],
    default: 'client',
  },

  isActive: {
    type:    Boolean,
    default: true,
  },

  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Service',
  }],

  lastLogin: {
    type: Date,
  },

  passwordChangedAt: Date,

  resetToken:        String,
  resetTokenExpires: Date,

}, {
  timestamps: true,
  toJSON:     { virtuals: true },
  toObject:   { virtuals: true },
});

/* ── Indexes ── */
UserSchema.index({ email: 1 });

/* ── Pre-save: hash password ── */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  if (!this.isNew) this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

/* ── Instance method: compare password ── */
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/* ── Instance method: check if password changed after JWT issued ── */
UserSchema.methods.passwordChangedAfter = function (jwtIat) {
  if (this.passwordChangedAt) {
    const changedAt = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return jwtIat < changedAt;
  }
  return false;
};

/* ── Virtual: initials ── */
UserSchema.virtual('initials').get(function () {
  return this.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

module.exports = mongoose.model('User', UserSchema);
