const mongoose = require('mongoose');
const Medicine = require('../models/Medicine');
const Pharmacy = require('../models/Pharmacy');
const Inventory = require('../models/Inventory');
const User = require('../models/User');

exports.getDashboardMetrics = async (req, res, next) => {
  try {
    const totalMedicines = await Medicine.countDocuments();
    const activeMedicines = await Medicine.countDocuments({ isActive: true });
    
    const totalPharmacies = await Pharmacy.countDocuments();
    const activePharmacies = await Pharmacy.countDocuments({ isActive: true });
    
    const totalInventory = await Inventory.countDocuments();
    const availableInventory = await Inventory.countDocuments({ availableQuantity: { $gt: 5 } });
    const limitedInventory = await Inventory.countDocuments({ availableQuantity: { $gt: 0, $lte: 5 } });
    const outOfStockInventory = await Inventory.countDocuments({ availableQuantity: 0 });
    
    const totalUsers = await User.countDocuments();

    // Data health checks
    const pharmaciesMissingCoords = await Pharmacy.countDocuments({ 
      $or: [
        { latitude: { $exists: false } }, 
        { longitude: { $exists: false } },
        { latitude: null },
        { longitude: null }
      ] 
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalMedicines,
        activeMedicines,
        totalPharmacies,
        activePharmacies,
        totalInventory,
        availableInventory,
        limitedInventory,
        outOfStockInventory,
        totalUsers,
        dataHealth: {
          pharmaciesMissingCoords
        }
      }
    });
  } catch (err) {
    next(err);
  }
};
