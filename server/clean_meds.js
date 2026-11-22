const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Medicine = require('./models/Medicine');
const Inventory = require('./models/Inventory');

async function cleanMedicineDups() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medioptima');
  
  const allMeds = await Medicine.find({});
  const map = {};
  allMeds.forEach(m => {
    const key = m.name.toLowerCase();
    if (!map[key]) map[key] = [];
    map[key].push(m);
  });
  
  for (const [key, meds] of Object.entries(map)) {
    if (meds.length > 1) {
      console.log(`Fixing duplicate: ${key}`);
      
      const master = meds[0];
      const duplicates = meds.slice(1);
      
      for (const dup of duplicates) {
        const result = await Inventory.updateMany(
          { medicine: dup._id },
          { $set: { medicine: master._id } }
        );
        console.log(`Updated ${result.modifiedCount} inventory records from ${dup._id} to ${master._id}`);
        await Medicine.findByIdAndDelete(dup._id);
        console.log(`Deleted duplicate medicine ${dup._id}`);
      }
    }
  }
  console.log("Cleanup complete!");
  process.exit(0);
}
cleanMedicineDups();
