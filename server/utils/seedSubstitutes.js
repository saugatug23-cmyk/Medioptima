const mongoose = require('mongoose');
const Medicine = require('../models/Medicine');
const Inventory = require('../models/Inventory');
const Pharmacy = require('../models/Pharmacy');

mongoose.connect('mongodb://127.0.0.1/medioptima').then(async () => {
  console.log('Connected. Seeding substitutes...');

  // Find some pharmacies
  const pharmacies = await Pharmacy.find({});
  if (pharmacies.length < 2) {
    console.error('Not enough pharmacies');
    process.exit(1);
  }

  // Add Dolo 650 (Substitute for Paracetamol)
  let dolo = await Medicine.findOne({ name: 'Dolo 650' });
  if (!dolo) {
    dolo = await Medicine.create({
      name: 'Dolo 650',
      genericName: 'Acetaminophen',
      brandName: 'Dolo',
      category: 'Analgesic/Antipyretic',
      dosage: '650mg',
      form: 'Tablet',
      description: 'Used to treat mild to moderate pain and fever.',
      prescriptionRequired: false,
      manufacturer: 'Micro Labs Ltd',
      activeIngredients: ['Acetaminophen']
    });
    console.log('Created Dolo 650');
  }

  // Add Crocin Advance (Substitute for Paracetamol)
  let crocin = await Medicine.findOne({ name: 'Crocin Advance' });
  if (!crocin) {
    crocin = await Medicine.create({
      name: 'Crocin Advance',
      genericName: 'Acetaminophen',
      brandName: 'Crocin',
      category: 'Analgesic/Antipyretic',
      dosage: '500mg',
      form: 'Tablet',
      description: 'Fast acting pain relief.',
      prescriptionRequired: false,
      manufacturer: 'GSK',
      activeIngredients: ['Acetaminophen']
    });
    console.log('Created Crocin Advance');
  }

  // Add Advil (Substitute for Ibuprofen)
  let advil = await Medicine.findOne({ name: 'Advil' });
  if (!advil) {
    advil = await Medicine.create({
      name: 'Advil',
      genericName: 'Ibuprofen',
      brandName: 'Advil',
      category: 'NSAID',
      dosage: '400mg',
      form: 'Tablet',
      description: 'Reduces inflammation and pain.',
      prescriptionRequired: false,
      manufacturer: 'Pfizer',
      activeIngredients: ['Ibuprofen']
    });
    console.log('Created Advil');
  }

  // Create Inventory for these substitutes
  // Dolo 650 -> Good stock
  await Inventory.findOneAndUpdate(
    { pharmacy: pharmacies[0]._id, medicine: dolo._id },
    { quantity: 150, price: 30 },
    { upsert: true }
  );
  
  // Crocin Advance -> Low stock
  await Inventory.findOneAndUpdate(
    { pharmacy: pharmacies[1]._id, medicine: crocin._id },
    { quantity: 5, price: 20 },
    { upsert: true }
  );

  // Advil -> Good stock
  await Inventory.findOneAndUpdate(
    { pharmacy: pharmacies[0]._id, medicine: advil._id },
    { quantity: 80, price: 120 }, // Advil is typically more expensive
    { upsert: true }
  );

  console.log('Substitutes seeded successfully.');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
