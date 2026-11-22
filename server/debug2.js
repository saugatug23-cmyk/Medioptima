const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Inventory = require('./models/Inventory');

async function debug() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medioptima');
  const all = await Inventory.find({});
  console.log("Total inventory:", all.length);
  if (all.length > 0) {
    console.log("First inv:", all[0]);
    console.log("pharmacy type:", typeof all[0].pharmacy);
    console.log("medicine type:", typeof all[0].medicine);
  }
  process.exit(0);
}
debug();
