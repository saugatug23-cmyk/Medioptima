const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

router.use(authenticate);
router.use(authorizeRoles('ADMIN'));

router.route('/')
  .get(userController.getUsers);

router.route('/:id/role')
  .put(userController.updateUserRole);

module.exports = router;
