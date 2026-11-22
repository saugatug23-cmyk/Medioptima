const mongoose = require('mongoose');
const Pharmacy = require('./models/Pharmacy');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medioptima');
  console.log('Connected to DB');
  const pharmacies = await Pharmacy.find({});
  for (const p of pharmacies) {
    if (p.latitude != null && p.longitude != null) {
      p.location = {
        type: 'Point',
        coordinates: [p.longitude, p.latitude]
      };
      p.isActive = p.isActive !== undefined ? p.isActive : true; // default backfill
      await p.save();
    }
  }
  console.log('Migration complete');
  process.exit(0);
}
migrate();
