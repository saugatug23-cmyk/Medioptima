const mongoose = require('mongoose');
const Pharmacy = require('../models/Pharmacy');

mongoose.connect('mongodb://127.0.0.1/medioptima').then(async () => {
  console.log('Connected. Seeding demo reliability data...');

  // 1. CityCare - Strong history
  await Pharmacy.findOneAndUpdate(
    { name: 'CityCare Pharmacy' },
    { 
      totalOrders: 200, 
      successfulOrders: 195, 
      historicalFulfillmentRate: 0.975, 
      stockAccuracyRate: 0.98, 
      averageDeliveryTime: 20 
    }
  );

  // 2. MediPlus - Frequent failed fulfilments
  await Pharmacy.findOneAndUpdate(
    { name: 'MediPlus Health' },
    { 
      totalOrders: 150, 
      successfulOrders: 90, 
      historicalFulfillmentRate: 0.60, 
      stockAccuracyRate: 0.75, 
      averageDeliveryTime: 30 
    }
  );

  // 3. GreenCross - Inaccurate inventory
  await Pharmacy.findOneAndUpdate(
    { name: 'GreenCross Meds' },
    { 
      totalOrders: 100, 
      successfulOrders: 85, 
      historicalFulfillmentRate: 0.85, 
      stockAccuracyRate: 0.40, // very inaccurate
      averageDeliveryTime: 25 
    }
  );

  // 4. QuickHeal - Poor delivery performance
  await Pharmacy.findOneAndUpdate(
    { name: 'QuickHeal Pharmacy' },
    { 
      totalOrders: 120, 
      successfulOrders: 110, 
      historicalFulfillmentRate: 0.91, 
      stockAccuracyRate: 0.92, 
      averageDeliveryTime: 180 // Very slow delivery (3 hours)
    }
  );

  // 5. Wellness Corner - Insufficient history
  await Pharmacy.findOneAndUpdate(
    { name: 'Wellness Corner' },
    { 
      totalOrders: 4, 
      successfulOrders: 4, 
      historicalFulfillmentRate: 1.0, 
      stockAccuracyRate: 1.0, 
      averageDeliveryTime: 15 
    }
  );

  console.log('Demo reliability data seeded for testing.');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
