const Medicine = require('../models/Medicine');
const AppError = require('../utils/AppError');

exports.getAllMedicines = async (req, res, next) => {
  try {
    let query = {};
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    if (req.query.search) {
      const searchStr = req.query.search;
      // Use regex to allow partial matches which is better for autocomplete
      const searchRegex = new RegExp(searchStr.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
      query = {
        $or: [
          { name: searchRegex },
          { genericName: searchRegex },
          { brandName: searchRegex },
          { activeIngredient: searchRegex },
          { searchableAliases: searchRegex }
        ]
      };
    }
    
    // Only return active medicines by default, unless explicitly queried or admin
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    } else if (!req.user || req.user.role !== 'ADMIN') {
      // Normal patients only see active medicines
      query.isActive = true;
    }

    const medicines = await Medicine.find(query).skip(skip).limit(limit).sort({ name: 1 });
    const total = await Medicine.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: medicines.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: {
        medicines // kept medicines here for backward compatibility
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMedicineById = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ status: 'fail', message: 'Medicine not found' });
    }
    res.status(200).json({
      status: 'success',
      data: {
        medicine
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.createMedicine = async (req, res, next) => {
  try {
    const { name, genericName, brandName, activeIngredient, strength, dosageForm, manufacturer, category, prescriptionRequired, description, price, currency, image, searchableAliases, source, sourceId, isActive } = req.body;
    
    if (!name) {
      return res.status(400).json({ status: 'fail', message: 'Medicine name is required.' });
    }

    if (price !== undefined && price < 0) {
      return res.status(400).json({ status: 'fail', message: 'Price cannot be negative.' });
    }

    const newMed = await Medicine.create({
      name, genericName, brandName, activeIngredient, strength, dosageForm, manufacturer, category, prescriptionRequired, description, price, currency, image, searchableAliases, source, sourceId, isActive
    });

    res.status(201).json({
      status: 'success',
      data: { medicine: newMed }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: 'fail', message: 'Duplicate medicine detected.' });
    }
    next(error);
  }
};

exports.updateMedicine = async (req, res, next) => {
  try {
    const med = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!med) {
      return res.status(404).json({ status: 'fail', message: 'Medicine not found' });
    }
    res.status(200).json({ status: 'success', data: { medicine: med } });
  } catch (error) {
    next(error);
  }
};

exports.toggleStatus = async (req, res, next) => {
  try {
    const med = await Medicine.findById(req.params.id);
    if (!med) {
      return res.status(404).json({ status: 'fail', message: 'Medicine not found' });
    }
    med.isActive = !med.isActive;
    await med.save();
    res.status(200).json({ status: 'success', data: { medicine: med } });
  } catch(err) {
    next(err);
  }
};

exports.importMedicines = async (req, res, next) => {
  try {
    const { medicines } = req.body;
    if (!medicines || !Array.isArray(medicines)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid data format. Expected an array of medicines.' });
    }

    let successCount = 0;
    let failCount = 0;
    let skippedCount = 0;

    for (const item of medicines) {
      if (!item.name) {
        failCount++;
        continue;
      }
      
      try {
        const existing = await Medicine.findOne({ name: item.name, genericName: item.genericName });
        if (existing) {
          skippedCount++;
          continue;
        }

        await Medicine.create({
          name: item.name,
          genericName: item.genericName,
          brandName: item.brandName,
          activeIngredient: item.activeIngredient,
          strength: item.strength,
          dosageForm: item.dosageForm,
          manufacturer: item.manufacturer,
          category: item.category,
          prescriptionRequired: String(item.prescriptionRequired).toLowerCase() === 'true',
          description: item.description,
          price: parseFloat(item.price) >= 0 ? parseFloat(item.price) : 0,
          currency: item.currency || 'INR',
          image: item.image,
          searchableAliases: Array.isArray(item.searchableAliases) ? item.searchableAliases : (item.searchableAliases ? String(item.searchableAliases).split(',').map(s=>s.trim()) : []),
          source: item.source || 'import',
          sourceId: item.sourceId
        });
        successCount++;
      } catch (err) {
        failCount++;
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        total: medicines.length,
        successful: successCount,
        skipped: skippedCount,
        failed: failCount
      }
    });

  } catch(error) {
    next(error);
  }
};
