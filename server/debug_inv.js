const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });
const Inventory = require('./server/models/Inventory');

async function debugInventory() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medioptima');
  const inv = await Inventory.findOne({}).populate('medicine pharmacy');
  console.log(JSON.stringify(inv, null, 2));
  process.exit(0);
}
debugInventory();