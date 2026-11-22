const mongoose = require('mongoose');

const historicalDeliverySchema = new mongoose.Schema({
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacy',
    required: true
  },
  distanceKm: { type: Number, required: true },
  trafficLevel: { type: Number, required: true }, // 0.0 to 1.0 (0=Clear, 1=Heavy)
  workloadLevel: { type: Number, required: true }, // 0.0 to 1.0 (0=Idle, 1=Overwhelmed)
  actualTimeMins: { type: Number, required: true },
  recordedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HistoricalDelivery', historicalDeliverySchema);
