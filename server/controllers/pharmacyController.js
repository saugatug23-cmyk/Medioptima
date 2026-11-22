const Pharmacy = require('../models/Pharmacy');

exports.getPharmacies = async (req, res, next) => {
  try {
    const pharmacies = await Pharmacy.find({});
    res.status(200).json({
      status: 'success',
      results: pharmacies.length,
      data: {
        pharmacies // maintained for existing UI format
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getPharmacy = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy) {
      return res.status(404).json({ status: 'fail', message: 'Pharmacy not found' });
    }
    res.status(200).json({
      status: 'success',
      data: {
        pharmacy
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.createPharmacy = async (req, res, next) => {
  try {
    const newPharmacy = await Pharmacy.create(req.body);
    res.status(201).json({ status: 'success', data: { pharmacy: newPharmacy } });
  } catch (error) {
    next(error);
  }
};

exports.updatePharmacy = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pharmacy) {
      return res.status(404).json({ status: 'fail', message: 'Pharmacy not found' });
    }
    res.status(200).json({ status: 'success', data: { pharmacy } });
  } catch (error) {
    next(error);
  }
};

exports.deletePharmacy = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy) {
      return res.status(404).json({ status: 'fail', message: 'Pharmacy not found' });
    }
    // Toggle active status instead of hard delete
    pharmacy.isActive = pharmacy.isActive === false ? true : false;
    // Keep isOpen in sync if it exists for backwards compatibility
    pharmacy.isOpen = pharmacy.isActive;
    await pharmacy.save();
    res.status(200).json({ status: 'success', data: { pharmacy } });
  } catch (error) {
    next(error);
  }
};
