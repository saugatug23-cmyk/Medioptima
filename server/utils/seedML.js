const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Inventory = require('../models/Inventory');
const Pharmacy = require('../models/Pharmacy');
const Medicine = require('../models/Medicine');
const HistoricalDemand = require('../models/HistoricalDemand');

dotenv.config({ path: path.join(__dirname, '../.env') });
const connectDB = require('../config/db');

const seedHistoricalData = async () => {
  await connectDB();
  console.log('Clearing old ML historical data...');
  await HistoricalDemand.deleteMany({});

  const inventories = await Inventory.find().populate('medicine').populate('pharmacy');
  
  if (inventories.length === 0) {
    console.log('No inventory found. Please run seed.js first.');
    process.exit(0);
  }

  const historyRecords = [];
  const today = new Date();

  console.log('Generating realistic 60-day historical data for prediction...');

  // Generate 60 days of history for each inventory item
  for (const inv of inventories) {
    const baseDemand = Math.floor(Math.random() * 10) + 2; 
    let currentSimulatedStock = Math.floor(Math.random() * 100) + 50;
    const leadTime = Math.floor(Math.random() * 10) + 2;

    for (let i = 60; i >= 1; i--) {
      const recordDate = new Date();
      recordDate.setDate(today.getDate() - i);
      
      let dailyDemand = Math.floor(baseDemand * (0.5 + Math.random()));
      if (Math.random() > 0.9) dailyDemand += Math.floor(Math.random() * 20);

      if (currentSimulatedStock <= leadTime * baseDemand * 0.5) {
        currentSimulatedStock += Math.floor(Math.random() * 100) + 50; 
      }

      const unitsSold = Math.min(dailyDemand, currentSimulatedStock);
      currentSimulatedStock -= unitsSold;

      const isStockout = currentSimulatedStock === 0;

      historyRecords.push({
        pharmacy: inv.pharmacy._id,
        medicine: inv.medicine._id,
        date: recordDate,
        availableStock: currentSimulatedStock,
        unitsSold: unitsSold,
        isStockout: isStockout,
        supplierLeadTimeDays: leadTime,
        isDemoData: true
      });
    }
  }

  await HistoricalDemand.insertMany(historyRecords);
  console.log('Inserted ' + historyRecords.length + ' historical records.');
  process.exit(0);
};

seedHistoricalData();
