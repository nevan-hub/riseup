/* ============================================
   RISEUP SECURITY — SERVICES ROUTES
   ============================================ */
'use strict';

const router  = require('express').Router();
const protect = require('../config/authMiddleware');
const { restrictTo } = require('../config/authMiddleware');
const Service = require('../models/Service');

router.use(protect);

/* GET /api/services — My services */
router.get('/', async (req, res, next) => {
  try {
    const services = await Service.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, count: services.length, services });
  } catch (err) { next(err); }
});

/* GET /api/services/:id */
router.get('/:id', async (req, res, next) => {
  try {
    const service = await Service.findOne({ _id: req.params.id, user: req.user._id });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
    res.json({ success: true, service });
  } catch (err) { next(err); }
});

/* POST /api/services — Admin only: create a service for a user */
router.post('/', restrictTo('admin', 'operator'), async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, service });
  } catch (err) { next(err); }
});

/* PATCH /api/services/:id/status — Admin only */
router.patch('/:id/status', restrictTo('admin', 'operator'), async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
    res.json({ success: true, service });
  } catch (err) { next(err); }
});

module.exports = router;
