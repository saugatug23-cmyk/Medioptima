const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

router.use(authenticate, authorizeRoles('ADMIN'));

router.get('/metrics', adminController.getDashboardMetrics);

const healthController = require('../controllers/healthController');
router.get('/system-status', healthController.getSystemStatus);

module.exports = router;
