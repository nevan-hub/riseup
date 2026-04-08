/* ============================================
   RISEUP SECURITY — USER ROUTES
   ============================================ */
'use strict';

const router  = require('express').Router();
const protect = require('../config/authMiddleware');
const User    = require('../models/User');

// All routes protected
router.use(protect);

/* GET /api/users/me — Full profile */
router.get('/me', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('services');
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

/* PATCH /api/users/me — Update profile */
router.patch('/me', async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'company'];
    const updates = {};
    allowed.forEach(field => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

/* PATCH /api/users/me/password — Change password */
router.patch('/me/password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both current and new password are required.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) { next(err); }
});

module.exports = router;
