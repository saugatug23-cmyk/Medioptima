const Inventory = require('../models/Inventory');

exports.getInventories = async (req, res, next) => {
  try {
    let query = {};
    if (req.user && req.user.role === 'PHARMACY') {
      if (!req.user.pharmacyId) {
        return res.status(403).json({ status: 'fail', message: 'No associated pharmacy found for user.' });
      }
      query.pharmacy = req.user.pharmacyId;
    } else if (req.query.pharmacyId) {
      query.pharmacy = req.query.pharmacyId;
    }

    const inventory = await Inventory.find(query)
      .populate('pharmacy', 'name address city state')
      .populate('medicine', 'name genericName strength dosageForm price');
      
    res.status(200).json({
      status: 'success',
      results: inventory.length,
      data: {
        inventory
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getInventory = async (req, res, next) => {
  try {
    const inventoryItem = await Inventory.findById(req.params.id)
      .populate('pharmacy')
      .populate('medicine');
      
    if (!inventoryItem) {
      return res.status(404).json({ status: 'fail', message: 'Inventory record not found' });
    }

    if (req.user && req.user.role === 'PHARMACY' && inventoryItem.pharmacy._id.toString() !== req.user.pharmacyId.toString()) {
      return res.status(403).json({ status: 'fail', message: 'Not authorized to view this inventory.' });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        inventory: inventoryItem
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.createInventory = async (req, res, next) => {
  try {
    const { medicineId, availableQuantity, price } = req.body;
    let pharmacyId = req.body.pharmacyId;

    if (req.user.role === 'PHARMACY') {
      pharmacyId = req.user.pharmacyId;
    }

    if (!pharmacyId) {
      return res.status(400).json({ status: 'fail', message: 'Pharmacy ID is required.' });
    }

    const updatedInv = await Inventory.findOneAndUpdate(
      { pharmacy: pharmacyId, medicine: medicineId },
      { 
        $set: { availableQuantity, price, isActive: true },
        $setOnInsert: { pharmacy: pharmacyId, medicine: medicineId }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ status: 'success', data: { inventory: updatedInv } });
  } catch (error) {
    next(error);
  }
};

exports.updateInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      return res.status(404).json({ status: 'fail', message: 'Inventory record not found' });
    }

    if (req.user.role === 'PHARMACY' && inventory.pharmacy.toString() !== req.user.pharmacyId.toString()) {
      return res.status(403).json({ status: 'fail', message: 'Not authorized to modify this inventory.' });
    }

    const { availableQuantity, price, isActive } = req.body;
    if (availableQuantity !== undefined) inventory.availableQuantity = availableQuantity;
    if (price !== undefined) inventory.price = price;
    if (isActive !== undefined) inventory.isActive = isActive;

    await inventory.save();

    res.status(200).json({ status: 'success', data: { inventory } });
  } catch(err) {
    next(err);
  }
};

exports.deleteInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      return res.status(404).json({ status: 'fail', message: 'Inventory record not found' });
    }

    if (req.user.role === 'PHARMACY' && inventory.pharmacy.toString() !== req.user.pharmacyId.toString()) {
      return res.status(403).json({ status: 'fail', message: 'Not authorized to delete this inventory.' });
    }

    inventory.isActive = false;
    await inventory.save();

    res.status(200).json({ status: 'success', data: null });
  } catch(err) {
    next(err);
  }
};
