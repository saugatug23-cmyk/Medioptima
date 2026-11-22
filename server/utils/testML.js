const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const HistoricalDemand = require('../models/HistoricalDemand');
dotenv.config({ path: path.join(__dirname, '../.env') });
const connectDB = require('../config/db');

async function test() {
  await connectDB();
  const allHistory = await HistoricalDemand.find({}).sort({ date: 1 });
  const grouped = {};
  allHistory.forEach(record => {
    const key = \\_\\;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(record);
  });
  console.log('Grouped keys:', Object.keys(grouped).length);
  if (Object.keys(grouped).length > 0) {
    console.log('Records in first key:', grouped[Object.keys(grouped)[0]].length);
  }
  process.exit(0);
}
test();
