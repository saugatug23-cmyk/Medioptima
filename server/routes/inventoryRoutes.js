const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

router.route('/')
  .get(authenticate, inventoryController.getInventories)
  .post(authenticate, authorizeRoles('ADMIN', 'PHARMACY'), inventoryController.createInventory);

router.route('/:id')
  .get(authenticate, inventoryController.getInventory)
  .put(authenticate, authorizeRoles('ADMIN', 'PHARMACY'), inventoryController.updateInventory)
  .delete(authenticate, authorizeRoles('ADMIN', 'PHARMACY'), inventoryController.deleteInventory);

module.exports = router;
