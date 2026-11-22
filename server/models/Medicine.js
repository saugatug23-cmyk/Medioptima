const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    genericName: { type: String },
    brandName: { type: String },
    activeIngredient: { type: String },
    strength: { type: String },
    dosageForm: { type: String }, // e.g., Tablet, Syrup, Injection
    manufacturer: { type: String },
    category: { type: String },
    prescriptionRequired: { type: Boolean, default: false },
    description: { type: String },
    price: { type: Number, min: 0, default: 0 },
    currency: { type: String, default: 'INR' },
    image: { type: String },
    searchableAliases: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    source: { type: String },
    sourceId: { type: String }
  },
  { timestamps: true }
);

// Indexes for search performance
medicineSchema.index({ name: 'text', genericName: 'text', brandName: 'text', activeIngredient: 'text', searchableAliases: 'text' }, {
  weights: {
    name: 10,
    brandName: 8,
    genericName: 6,
    searchableAliases: 5,
    activeIngredient: 3
  },
  name: 'MedicineTextSearchIndex'
});

medicineSchema.index({ name: 1 });
medicineSchema.index({ category: 1 });
medicineSchema.index({ isActive: 1 });

module.exports = mongoose.model('Medicine', medicineSchema);
