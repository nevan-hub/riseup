/* ============================================
   RISEUP SECURITY — AUTH ROUTES
   ============================================ */
'use strict';

const router     = require('express').Router();
const controller = require('../controllers/authController');
const protect    = require('../config/authMiddleware');

// Public
router.post('/register', controller.register);
router.post('/login',    controller.login);
router.post('/logout',   controller.logout);

// Protected
router.get('/me', protect, controller.getMe);

module.exports = router;
