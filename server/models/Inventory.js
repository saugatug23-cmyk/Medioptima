const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    availableQuantity: { type: Number, required: true, min: 0, default: 0 },
    price: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now },
    
    // For future shortage prediction
    previousQuantity: { type: Number, default: 0 },
    unitsSoldLast7Days: { type: Number, default: 0 },
    unitsSoldLast30Days: { type: Number, default: 0 },
    averageDailyDemand: { type: Number, default: 0 },
    previousShortageCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Prevent duplicate inventory records per pharmacy/medicine pair
inventorySchema.index({ pharmacy: 1, medicine: 1 }, { unique: true });

// Ensure lastUpdated is updated
inventorySchema.pre('save', function (next) {
  this.lastUpdated = new Date();
  if(typeof next === 'function') next();
});

module.exports = mongoose.model('Inventory', inventorySchema);
