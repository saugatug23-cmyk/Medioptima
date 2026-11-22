const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Medicine = require('./models/Medicine');
const Inventory = require('./models/Inventory');

async function checkDups() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medioptima');
  
  const allMeds = await Medicine.find({});
  const map = {};
  allMeds.forEach(m => {
    const key = m.name.toLowerCase();
    if (!map[key]) map[key] = [];
    map[key].push(m);
  });
  
  let dupCount = 0;
  for (const [key, meds] of Object.entries(map)) {
    if (meds.length > 1) {
      console.log(`Duplicate: ${key} -> ${meds.length} records`);
      meds.forEach(m => console.log(`  - ${m._id}`));
      dupCount++;
    }
  }
  console.log("Total unique medicines with duplicates:", dupCount);
  process.exit(0);
}
checkDups();