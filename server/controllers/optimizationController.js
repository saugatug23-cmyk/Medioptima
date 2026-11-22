const Inventory = require('../models/Inventory');
const Medicine = require('../models/Medicine');
const optimizationService = require('../services/optimizationService');
const shortagePredictionService = require('../services/shortagePredictionService');
const reliabilityService = require('../services/reliabilityService');
const deliveryTimeService = require('../services/deliveryTimeService');

exports.generatePharmacyPlan = async (req, res, next) => {
  try {
    const { medicines, location, preferredPharmacies } = req.body;
    
    if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide an array of medicines with their ids and quantities'
      });
    }

    const medicineIds = medicines.map(m => m.id || m.medicineId);

    // 1. Fetch inventory data across all pharmacies
    let inventoryResults = await Inventory.find({ medicine: { $in: medicineIds }, isActive: true })
      .populate('pharmacy', 'name address latitude longitude reliability')
      .populate('medicine', 'name genericName form dosage category');
    inventoryResults = inventoryResults.filter(inv => inv.pharmacy && inv.medicine);

    // 2. Map requested medicines
    const requestedMedicines = medicines.map(m => {
      const invMatch = inventoryResults.find(i => i.medicine._id.toString() === (m.id || m.medicineId));
      return {
        id: m.id || m.medicineId,
        quantity: parseInt(m.quantity) || 1,
        name: m.name || (invMatch ? invMatch.medicine.name : 'Unknown Medicine')
      };
    });

    let userLocation = {};
    if (location && typeof location === 'object' && location.lat) {
      userLocation = location;
    }

    // 3. Fetch predictions (Shortage, Reliability, Delivery Time)
    const shortageRisks = {};
    const reliabilityScores = {};
    const predictedDeliveryTimes = {};

    for (const inv of inventoryResults) {
      const pId = inv.pharmacy._id.toString();
      const mId = inv.medicine._id.toString();
      
      const riskKey = `${pId}_${mId}`;
      try {
        const prediction = await shortagePredictionService.predictShortage(pId, mId);
        if (prediction && prediction.hasData) {
          shortageRisks[riskKey] = prediction.riskScore;
        }
      } catch (err) {
        console.error('Error fetching shortage prediction for', riskKey, err);
      }

      // Fetch reliability once per pharmacy
      if (reliabilityScores[pId] === undefined) {
        try {
          const relData = await reliabilityService.calculateReliability(pId);
          if (relData && relData.reliabilityScore !== null) {
            reliabilityScores[pId] = relData.reliabilityScore;
          } else {
            reliabilityScores[pId] = null; 
          }
        } catch (err) {
          console.error('Error fetching reliability for', pId, err);
          reliabilityScores[pId] = null;
        }
      }

      // Fetch delivery time once per pharmacy
      if (predictedDeliveryTimes[pId] === undefined && userLocation.lat) {
        try {
          const deliveryPrediction = await deliveryTimeService.predictDeliveryTime(pId, userLocation);
          if (deliveryPrediction && deliveryPrediction.estimatedMinutes !== null) {
            predictedDeliveryTimes[pId] = deliveryPrediction.estimatedMinutes;
          } else {
            predictedDeliveryTimes[pId] = null;
          }
        } catch (err) {
          console.error('Error fetching delivery time for', pId, err);
          predictedDeliveryTimes[pId] = null;
        }
      }
    }

    // 4. Run Optimization Algorithm
    const plan = await optimizationService.generatePharmacyPlan(
      requestedMedicines, 
      inventoryResults, 
      userLocation,
      shortageRisks,
      reliabilityScores,
      predictedDeliveryTimes
    );

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });

  } catch (error) {
    console.error('Optimization error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate pharmacy plan'
    });
  }
};
