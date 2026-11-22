const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacyController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

router.route('/')
  .get(authenticate, pharmacyController.getPharmacies)
  .post(authenticate, authorizeRoles('ADMIN'), pharmacyController.createPharmacy);

router.route('/:id')
  .get(authenticate, pharmacyController.getPharmacy)
  .put(authenticate, authorizeRoles('ADMIN'), pharmacyController.updatePharmacy)
  .delete(authenticate, authorizeRoles('ADMIN'), pharmacyController.deletePharmacy);

module.exports = router;
