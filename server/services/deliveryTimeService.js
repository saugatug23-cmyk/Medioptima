const { RandomForestRegression } = require('ml-random-forest');
const HistoricalDelivery = require('../models/HistoricalDelivery');
const Pharmacy = require('../models/Pharmacy');

let model = null;
let isModelReady = false;

// Helper to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 2.0;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;  
  const dLon = (lon2 - lon1) * Math.PI / 180; 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

// Simulated real-time variables since we don't have live APIs
function getCurrentConditions(pharmacyId) {
  const hour = new Date().getHours();
  // Peak hours: 9-11 AM and 5-7 PM
  const isPeak = (hour >= 9 && hour <= 11) || (hour >= 17 && hour <= 19);
  
  // Deterministic pseudo-random based on pharmacy ID length/chars to keep it stable
  const pFactor = String(pharmacyId).charCodeAt(0) % 5 / 10; 
  
  let trafficLevel = isPeak ? 0.7 + pFactor : 0.2 + pFactor;
  let workloadLevel = isPeak ? 0.6 + pFactor : 0.3 + pFactor;
  
  return {
    trafficLevel: Math.min(1.0, trafficLevel),
    workloadLevel: Math.min(1.0, workloadLevel)
  };
}

exports.trainModel = async () => {
  try {
    const count = await HistoricalDelivery.countDocuments();
    if (count === 0) {
      console.log('No historical delivery data found. Auto-generating development ML data...');
      
      const pharmacies = await Pharmacy.find({});
      if (pharmacies.length > 0) {
        const seedData = [];
        for (const p of pharmacies) {
          // Generate 50 records per pharmacy
          for (let i = 0; i < 50; i++) {
            const distanceKm = Number((Math.random() * 10 + 0.5).toFixed(1)); // 0.5 to 10.5 km
            const trafficLevel = Number(Math.random().toFixed(2));
            const workloadLevel = Number(Math.random().toFixed(2));
            
            // Base time: 5 mins prep + 4 mins per km
            // Traffic penalty: up to +15 mins
            // Workload penalty: up to +10 mins
            let time = 5 + (distanceKm * 4) + (trafficLevel * 15) + (workloadLevel * 10);
            
            // Random variance +/- 10%
            time = time * (0.9 + Math.random() * 0.2);
            
            seedData.push({
              pharmacy: p._id,
              distanceKm,
              trafficLevel,
              workloadLevel,
              actualTimeMins: Math.round(time)
            });
          }
        }
        await HistoricalDelivery.insertMany(seedData);
        console.log(`Generated ${seedData.length} delivery records.`);
      }
    }

    const data = await HistoricalDelivery.find({});
    if (data.length === 0) {
      // removed
      return;
    }

    const X = data.map(d => [d.distanceKm, d.trafficLevel, d.workloadLevel]);
    const y = data.map(d => d.actualTimeMins);

    const options = {
      seed: 42,
      maxFeatures: 3,
      replacement: false,
      nEstimators: 50
    };

    model = new RandomForestRegression(options);
    model.train(X, y);
    isModelReady = true;

    console.log(`Delivery Prediction Model trained successfully on ${X.length} samples.`);
  } catch (error) {
    console.error('Failed to train delivery model:', error);
  }
};

exports.predictDeliveryTime = async (pharmacyId, userLocation) => {
  if (!isModelReady || !model) {
    return { estimatedMinutes: null, error: 'Model not trained' };
  }

  const pharmacy = await Pharmacy.findById(pharmacyId);
  if (!pharmacy) {
    throw new Error('Pharmacy not found');
  }

  const distanceKm = calculateDistance(
    userLocation.lat, userLocation.lon,
    pharmacy.latitude, pharmacy.longitude
  );

  const { trafficLevel, workloadLevel } = getCurrentConditions(pharmacyId);

  const features = [distanceKm, trafficLevel, workloadLevel];
  
  const predictedValue = model.predict([features])[0];
  const estimatedMinutes = Math.round(predictedValue);
  
  return {
    estimatedMinutes,
    featuresUsed: {
      distanceKm: parseFloat(distanceKm.toFixed(1)),
      trafficLevel: parseFloat(trafficLevel.toFixed(2)),
      workloadLevel: parseFloat(workloadLevel.toFixed(2))
    }
  };
};
