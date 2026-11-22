const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    openingTime: { type: String },
    closingTime: { type: String },
    isOpen: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    deliveryAvailable: { type: Boolean, default: false },
    historicalFulfillmentRate: { type: Number, default: 0 },
    stockAccuracyRate: { type: Number, default: 0 },
    averageDeliveryTime: { type: Number, default: 0 }, 
    totalOrders: { type: Number, default: 0 },
    successfulOrders: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// GeoJSON index for  queries
pharmacySchema.index({ location: '2dsphere' });

// Keep legacy lat/lon in sync with GeoJSON before saving
pharmacySchema.pre('validate', function(next) {
  if (this.latitude != null && this.longitude != null) {
    this.location = {
      type: 'Point',
      coordinates: [this.longitude, this.latitude]
    };
  }
  if (typeof next === 'function') next();
});

module.exports = mongoose.model('Pharmacy', pharmacySchema);
