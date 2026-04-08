/* ============================================
   RISEUP SECURITY — AUTH MIDDLEWARE
   ============================================ */
'use strict';

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'riseup-security-jwt-secret-change-in-production';

module.exports = async function protect(req, res, next) {
  try {
    // 1. Get token from header
    const auth  = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'You must be logged in to access this resource.' });
    }

    const token = auth.split(' ')[1];

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Your session has expired. Please sign in again.' });
      }
      return res.status(401).json({ success: false, message: 'Invalid authentication token.' });
    }

    // 3. Check user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'The account associated with this token no longer exists.' });
    }

    // 4. Check user is active
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'This account has been deactivated.' });
    }

    // 5. Check if password was changed after token was issued
    if (user.passwordChangedAfter(decoded.iat)) {
      return res.status(401).json({ success: false, message: 'Password was recently changed. Please sign in again.' });
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (err) {
    next(err);
  }
};

/* ── Role restriction ── */
module.exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action.',
      });
    }
    next();
  };
};
