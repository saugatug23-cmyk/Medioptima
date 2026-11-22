const mongoose = require('mongoose');

const historicalDemandSchema = new mongoose.Schema(
  {
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    date: { type: Date, required: true },
    availableStock: { type: Number, required: true },
    unitsSold: { type: Number, required: true },
    isStockout: { type: Boolean, required: true },
    supplierLeadTimeDays: { type: Number, required: true, default: 3 }, // days
    isDemoData: { type: Boolean, default: true } // Mark as demo data explicitly
  },
  { timestamps: true }
);

module.exports = mongoose.model('HistoricalDemand', historicalDemandSchema);
