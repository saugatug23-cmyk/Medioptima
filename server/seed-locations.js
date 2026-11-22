const mongoose = require('mongoose');
const Pharmacy = require('./models/Pharmacy');
require('dotenv').config({ path: './.env' });

const dbUrl = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medioptima';

const pharmaciesToSeed = [
  { name: 'MEDIKARA HEALTHCARE', address: 'Silchar', city: 'Silchar', state: 'Assam', location: { type: 'Point', coordinates: [92.793, 24.815] }, dataStatus: 'location_reference', isActive: true },
  { name: 'Apollo Pharmacy Silchar ONGC', address: 'ONGC Base, Silchar', city: 'Silchar', state: 'Assam', location: { type: 'Point', coordinates: [92.784, 24.789] }, dataStatus: 'location_reference', isActive: true },
  { name: 'Apollo Pharmacy Sonai Road Silchar', address: 'Sonai Road, Silchar', city: 'Silchar', state: 'Assam', location: { type: 'Point', coordinates: [92.812, 24.801] }, dataStatus: 'location_reference', isActive: true },
  { name: '3MG Medicine Mart', address: 'Tarapur, Silchar', city: 'Silchar', state: 'Assam', location: { type: 'Point', coordinates: [92.775, 24.832] }, dataStatus: 'location_reference', isActive: true },
  { name: 'Generic Aadhaar Silchar - SREE RAMAN MEDICAL STORES', address: 'Link Road, Silchar', city: 'Silchar', state: 'Assam', location: { type: 'Point', coordinates: [92.802, 24.825] }, dataStatus: 'location_reference', isActive: true },
  { name: 'Abu Medicine Centre', address: 'Hospital Road, Silchar', city: 'Silchar', state: 'Assam', location: { type: 'Point', coordinates: [92.791, 24.818] }, dataStatus: 'location_reference', isActive: true },
  { name: 'HealthX Pharmacy', address: 'Meherpur, Silchar', city: 'Silchar', state: 'Assam', location: { type: 'Point', coordinates: [92.805, 24.795] }, dataStatus: 'location_reference', isActive: true },
  { name: 'Quickobook Pharmacy', address: 'Premtala, Silchar', city: 'Silchar', state: 'Assam', location: { type: 'Point', coordinates: [92.798, 24.820] }, dataStatus: 'location_reference', isActive: true },
  { name: 'J R Pharmaceuticals', address: 'N.S. Avenue, Silchar', city: 'Silchar', state: 'Assam', location: { type: 'Point', coordinates: [92.801, 24.810] }, dataStatus: 'location_reference', isActive: true },
  { name: 'City Drugs', address: 'Capital Point, Silchar', city: 'Silchar', state: 'Assam', location: { type: 'Point', coordinates: [92.795, 24.821] }, dataStatus: 'location_reference', isActive: true }
];

async function run() {
  await mongoose.connect(dbUrl);
  console.log('Connected to MongoDB');
  
  for (const p of pharmaciesToSeed) {
    p.latitude = p.location.coordinates[1];
    p.longitude = p.location.coordinates[0];
    await Pharmacy.updateOne({ name: p.name }, { $set: p }, { upsert: true });
  }
  
  console.log('Seeded actual Silchar pharmacies.');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
