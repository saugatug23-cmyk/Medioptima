const express = require('express');
const router = express.Router();

const pharmacyController = require('../controllers/pharmacyController');
const medicineController = require('../controllers/medicineController');
const inventoryController = require('../controllers/inventoryController');
const searchController = require('../controllers/searchController');
const optimizationController = require('../controllers/optimizationController');
const shortageController = require('../controllers/shortageController');
const reliabilityController = require('../controllers/reliabilityController');
const deliveryTimeController = require('../controllers/deliveryTimeController');
const recommendationController = require('../controllers/recommendationController');
const healthController = require('../controllers/healthController');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');

const { authenticate } = require('../middleware/auth');

router.get('/health', healthController.getHealthStatus);

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

const pharmacyRoutes = require('./pharmacyRoutes');
router.use('/pharmacies', pharmacyRoutes);

const medicineRoutes = require('./medicineRoutes');
router.use('/medicines', medicineRoutes);

const inventoryRoutes = require('./inventoryRoutes');
router.use('/inventory', inventoryRoutes);

const routingController = require('../controllers/routingController');

router.post('/search', authenticate, searchController.searchMedicines);
router.post('/optimization/pharmacy-plan', authenticate, optimizationController.generatePharmacyPlan);
router.post('/route/calculate', authenticate, routingController.calculateRoute);
router.post('/shortage/predict', authenticate, shortageController.predictShortage);
router.post('/shortage/train', shortageController.train);
router.get('/pharmacies/:pharmacyId/reliability', authenticate, reliabilityController.getPharmacyReliability);
router.post('/delivery-time/predict', authenticate, deliveryTimeController.predictDeliveryTime);
router.get('/recommendations/:medicineId', authenticate, recommendationController.getRecommendations);

const adminRoutes = require('./adminRoutes');
router.use('/admin', adminRoutes);

module.exports = router;


