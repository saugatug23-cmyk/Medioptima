const Inventory = require('../models/Inventory');
const Pharmacy = require('../models/Pharmacy');
const Medicine = require('../models/Medicine');

exports.searchMedicines = async (req, res, next) => {
  try {
    const { medicines, location, radius = 50 } = req.body; // Default 50km
    
    if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide an array of medicines with their ids and quantities'
      });
    }

    if (!location || (!location.lat && !location.latitude)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please select your location to find nearby pharmacies.'
      });
    }

    const lat = parseFloat(location.lat || location.latitude);
    const lng = parseFloat(location.lng || location.longitude);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        status: 'fail',
        message: 'We could not use that location. Please choose another location.'
      });
    }

    const medicineIds = medicines.map(m => m.id || m.medicineId);

    // 1. Find all nearby active pharmacies using $geoNear
    const pharmacies = await Pharmacy.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lng, lat] },
          distanceField: 'calculatedDistance', // in meters
          maxDistance: radius * 1000,
          query: { $or: [{ isActive: true }, { isOpen: true }] },
          spherical: true
        }
      }
    ]);

    if (!pharmacies || pharmacies.length === 0) {
      return res.status(200).json({
        status: 'success',
        data: { pharmacies: [], message: 'No nearby pharmacies were found in this area.' }
      });
    }

    // 1.5 Fetch medicine details to guarantee names
    const medicineDetails = await Medicine.find({ _id: { $in: medicineIds } });
    const medicineMap = new Map(medicineDetails.map(m => [m._id.toString(), m.name]));

    // 2. Find active inventory records
    const pharmacyIds = pharmacies.map(p => p._id);
    const inventoryResults = await Inventory.find({ 
      pharmacy: { $in: pharmacyIds },
      medicine: { $in: medicineIds }, 
      isActive: true 
    });

    let anyPharmacyHasStock = false;
    let anyInventoryReported = false;

    // 3. Process each pharmacy
    const processedPharmacies = pharmacies.map(pharm => {
      const distance = pharm.calculatedDistance / 1000; // Convert to km

      // Check requested medicines
      let fullCount = 0;
      let partialCount = 0;
      let outOfStockCount = 0;
      let notReportedCount = 0;
      let latestUpdate = null;

      const requestedMedicines = medicines.map(reqMed => {
        const medId = reqMed.id || reqMed.medicineId;
        const requestedQuantity = parseInt(reqMed.quantity, 10) || 1;
        
        const invItem = inventoryResults.find(i => 
          i.pharmacy.toString() === pharm._id.toString() && 
          i.medicine.toString() === medId.toString()
        );

        let status = 'not_reported';
        let availableQuantity = 0;
        let price = 0;
        
        const medicineName = medicineMap.get(medId.toString()) || reqMed.name || 'Unknown Medicine';

        if (invItem) {
          anyInventoryReported = true;
          availableQuantity = invItem.availableQuantity;
          price = invItem.price;
          if (invItem.lastUpdated) {
            if (!latestUpdate || new Date(invItem.lastUpdated) > new Date(latestUpdate)) {
              latestUpdate = invItem.lastUpdated;
            }
          }

          if (availableQuantity >= requestedQuantity) {
            status = 'available';
            fullCount++;
            anyPharmacyHasStock = true;
          } else if (availableQuantity > 0) {
            status = 'partial';
            partialCount++;
            anyPharmacyHasStock = true;
          } else {
            status = 'out_of_stock';
            outOfStockCount++;
          }
        } else {
          status = 'not_reported';
          notReportedCount++;
        }

        return {
          medicineId: medId,
          medicineName,
          requestedQuantity,
          availableQuantity,
          status,
          price
        };
      });

      let availabilitySummary = 'Unavailable';
      if (fullCount === requestedMedicines.length) {
        availabilitySummary = 'Fully Available';
      } else if (fullCount > 0 || partialCount > 0) {
        availabilitySummary = 'Partially Available';
      } else if (notReportedCount === requestedMedicines.length) {
        availabilitySummary = 'Not Reported';
      } else if (outOfStockCount > 0) {
        availabilitySummary = 'Out of Stock';
      }

      return {
        pharmacyId: pharm._id,
        name: pharm.name,
        address: pharm.address,
        latitude: pharm.latitude,
        longitude: pharm.longitude,
        distance,
        requestedMedicines,
        availabilitySummary,
        inventoryLastUpdated: latestUpdate
      };
    });

    if (!anyPharmacyHasStock) {
      let msg = anyInventoryReported
        ? 'Currently out of stock at nearby pharmacies.'
        : 'The pharmacy is nearby, but inventory for this medicine has not been reported.';

      return res.status(200).json({
        status: 'success',
        data: { 
          pharmacies: processedPharmacies,
          message: msg
        }
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        pharmacies: processedPharmacies,
        message: 'success'
      }
    });
  } catch (error) {
    next(error);
  }
};
