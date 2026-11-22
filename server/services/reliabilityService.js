/**
 * Reliability Service
 * Calculates pharmacy reliability based on historical performance
 */
const Pharmacy = require('../models/Pharmacy');

// Configurable weights (must sum to 1.0)
const WEIGHTS = {
  fulfillment: 0.50,
  stockAccuracy: 0.30,
  delivery: 0.20
};

// Thresholds
const MIN_ORDERS_FOR_RELIABILITY = 10;
const IDEAL_DELIVERY_TIME_MINS = 30;
const MAX_ACCEPTABLE_DELIVERY_TIME_MINS = 120; // At this point, delivery score becomes 0

exports.calculateReliability = async (pharmacyId) => {
  const pharmacy = await Pharmacy.findById(pharmacyId);
  if (!pharmacy) {
    throw new Error('Pharmacy not found');
  }

  // 1. Check for insufficient data
  if (!pharmacy.totalOrders || pharmacy.totalOrders < MIN_ORDERS_FOR_RELIABILITY) {
    return {
      pharmacyId: pharmacy._id,
      reliabilityScore: null,
      status: 'Insufficient data'
    };
  }

  // 2. Extract features
  const fulfillmentScore = pharmacy.historicalFulfillmentRate || 0;
  const stockScore = pharmacy.stockAccuracyRate || 0;
  
  // Calculate delivery score (0 to 1)
  let deliveryScore = 1.0;
  const avgDelivery = pharmacy.averageDeliveryTime || IDEAL_DELIVERY_TIME_MINS;
  if (avgDelivery > IDEAL_DELIVERY_TIME_MINS) {
    const delay = avgDelivery - IDEAL_DELIVERY_TIME_MINS;
    const maxDelay = MAX_ACCEPTABLE_DELIVERY_TIME_MINS - IDEAL_DELIVERY_TIME_MINS;
    deliveryScore = Math.max(0, 1.0 - (delay / maxDelay));
  }

  // 3. Compute final weighted score
  const reliabilityScore = 
    (fulfillmentScore * WEIGHTS.fulfillment) +
    (stockScore * WEIGHTS.stockAccuracy) +
    (deliveryScore * WEIGHTS.delivery);

  // Enforce bounds
  const boundedScore = Math.max(0, Math.min(1, reliabilityScore));
  const roundedScore = parseFloat(boundedScore.toFixed(2));

  // 4. Determine status label
  let status = 'Low';
  if (roundedScore >= 0.8) {
    status = 'High';
  } else if (roundedScore >= 0.5) {
    status = 'Moderate';
  }

  return {
    pharmacyId: pharmacy._id,
    reliabilityScore: roundedScore,
    status
  };
};
