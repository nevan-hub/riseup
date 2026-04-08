/* ============================================
   RISEUP SECURITY — AUTH CONTROLLER
   ============================================ */
'use strict';

const jwt       = require('jsonwebtoken');
const User      = require('../models/User');

const JWT_SECRET  = process.env.JWT_SECRET  || 'riseup-security-jwt-secret-change-in-production';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

/* ── Sign token ── */
function signToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

/* ── Safe user object (no password) ── */
function safeUser(user) {
  return {
    id:      user._id,
    name:    user.name,
    email:   user.email,
    phone:   user.phone,
    company: user.company,
    role:    user.role,
  };
}

/* ── POST /api/auth/register ── */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, company } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const user  = await User.create({ name, email, password, phone: phone || '', company: company || '' });
    const token = signToken(user._id);

    console.log(`[Auth] New registration: ${email}`);

    res.status(201).json({
      success: true,
      token,
      user: safeUser(user),
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message).join(' ');
      return res.status(400).json({ success: false, message: messages });
    }
    next(err);
  }
};

/* ── POST /api/auth/login ── */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'This account has been deactivated. Please contact support.' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);

    console.log(`[Auth] Login: ${email}`);

    res.json({
      success: true,
      token,
      user: safeUser(user),
    });

  } catch (err) {
    next(err);
  }
};

/* ── GET /api/auth/me ── */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.json({ success: true, user: safeUser(user) });
  } catch (err) {
    next(err);
  }
};

/* ── POST /api/auth/logout ── */
exports.logout = (req, res) => {
  // JWT is stateless — client clears the token
  res.json({ success: true, message: 'Logged out successfully.' });
};
