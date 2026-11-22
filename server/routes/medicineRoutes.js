const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

router.route('/')
  .get(authenticate, medicineController.getAllMedicines)
  .post(authenticate, authorizeRoles('ADMIN'), medicineController.createMedicine);

router.route('/import')
  .post(authenticate, authorizeRoles('ADMIN'), medicineController.importMedicines);

router.route('/:id')
  .get(authenticate, medicineController.getMedicineById)
  .put(authenticate, authorizeRoles('ADMIN'), medicineController.updateMedicine);

router.route('/:id/status')
  .patch(authenticate, authorizeRoles('ADMIN'), medicineController.toggleStatus);

module.exports = router;
