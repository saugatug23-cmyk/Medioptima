const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Pharmacy = require('../models/Pharmacy');
const Medicine = require('../models/Medicine');
const Inventory = require('../models/Inventory');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');

const pharmaciesData = [
  { name: 'CityCare Pharmacy', address: '123 Downtown St', city: 'Metropolis', state: 'NY', pincode: '10001', latitude: 40.7128, longitude: -74.0060, openingTime: '08:00', closingTime: '22:00' },
  { name: 'MediPlus Health', address: '456 Westside Ave', city: 'Metropolis', state: 'NY', pincode: '10002', latitude: 40.7138, longitude: -74.0070, openingTime: '24 Hours', closingTime: '24 Hours' },
  { name: 'GreenCross Meds', address: '789 East Blvd', city: 'Metropolis', state: 'NY', pincode: '10003', latitude: 40.7118, longitude: -74.0050, openingTime: '09:00', closingTime: '21:00' },
  { name: 'QuickHeal Pharmacy', address: '101 North Road', city: 'Metropolis', state: 'NY', pincode: '10004', latitude: 40.7148, longitude: -74.0080, openingTime: '08:00', closingTime: '20:00' },
  { name: 'Wellness Corner', address: '202 South St', city: 'Metropolis', state: 'NY', pincode: '10005', latitude: 40.7108, longitude: -74.0040, openingTime: '09:00', closingTime: '22:00' }
];

const medicinesData = [
  { name: 'Paracetamol', genericName: 'Acetaminophen', brandName: 'Tylenol', category: 'Analgesic', dosage: '500mg', form: 'Tablet' },
  { name: 'Cetirizine', genericName: 'Cetirizine Hydrochloride', brandName: 'Zyrtec', category: 'Antihistamine', dosage: '10mg', form: 'Tablet' },
  { name: 'Azithromycin', genericName: 'Azithromycin', brandName: 'Zithromax', category: 'Antibiotic', dosage: '250mg', form: 'Tablet', prescriptionRequired: true },
  { name: 'Ibuprofen', genericName: 'Ibuprofen', brandName: 'Advil', category: 'NSAID', dosage: '400mg', form: 'Tablet' },
  { name: 'Amoxicillin', genericName: 'Amoxicillin', brandName: 'Amoxil', category: 'Antibiotic', dosage: '500mg', form: 'Capsule', prescriptionRequired: true },
  { name: 'Loratadine', genericName: 'Loratadine', brandName: 'Claritin', category: 'Antihistamine', dosage: '10mg', form: 'Tablet' },
  { name: 'Omeprazole', genericName: 'Omeprazole', brandName: 'Prilosec', category: 'Proton Pump Inhibitor', dosage: '20mg', form: 'Capsule' },
  { name: 'Metformin', genericName: 'Metformin', brandName: 'Glucophage', category: 'Antidiabetic', dosage: '500mg', form: 'Tablet', prescriptionRequired: true },
  { name: 'Atorvastatin', genericName: 'Atorvastatin', brandName: 'Lipitor', category: 'Statin', dosage: '20mg', form: 'Tablet', prescriptionRequired: true },
  { name: 'Amlodipine', genericName: 'Amlodipine', brandName: 'Norvasc', category: 'Calcium Channel Blocker', dosage: '5mg', form: 'Tablet', prescriptionRequired: true }
];

const seedDB = async () => {
  await connectDB();

  try {
    // Clear existing data safely
    await Inventory.deleteMany({});
    await Pharmacy.deleteMany({});
    await Medicine.deleteMany({});
    await User.deleteMany({});

    console.log('Old development data cleared.');

    // Insert Pharmacies
    const insertedPharmacies = await Pharmacy.insertMany(pharmaciesData);
    console.log(`Inserted ${insertedPharmacies.length} pharmacies.`);

    // Insert Medicines
    const insertedMedicines = await Medicine.insertMany(medicinesData);
    console.log(`Inserted ${insertedMedicines.length} medicines.`);

    // Prepare Inventory combinations to make it interesting
    // Paracetamol, Cetirizine, Azithromycin are our main test cases
    const paracetamol = insertedMedicines.find(m => m.name === 'Paracetamol');
    const cetirizine = insertedMedicines.find(m => m.name === 'Cetirizine');
    const azithromycin = insertedMedicines.find(m => m.name === 'Azithromycin');

    const inventoryData = [
      // Pharmacy 0 has Paracetamol (Full) and Cetirizine (Partial)
      { pharmacy: insertedPharmacies[0]._id, medicine: paracetamol._id, quantity: 50, price: 30.00 },
      { pharmacy: insertedPharmacies[0]._id, medicine: cetirizine._id, quantity: 8, price: 25.00 },
      
      // Pharmacy 1 has Cetirizine (Full) and Azithromycin (Unavailable)
      { pharmacy: insertedPharmacies[1]._id, medicine: cetirizine._id, quantity: 30, price: 22.50 },
      { pharmacy: insertedPharmacies[1]._id, medicine: azithromycin._id, quantity: 0, price: 110.00 },
      
      // Pharmacy 2 has all three (Full) - Optimal single stop
      { pharmacy: insertedPharmacies[2]._id, medicine: paracetamol._id, quantity: 100, price: 28.50 },
      { pharmacy: insertedPharmacies[2]._id, medicine: cetirizine._id, quantity: 45, price: 20.00 },
      { pharmacy: insertedPharmacies[2]._id, medicine: azithromycin._id, quantity: 20, price: 95.00 },
      
      // Pharmacy 3 has random others
      { pharmacy: insertedPharmacies[3]._id, medicine: insertedMedicines[3]._id, quantity: 40, price: 45.00 },
      { pharmacy: insertedPharmacies[3]._id, medicine: insertedMedicines[4]._id, quantity: 15, price: 85.00 }
    ];

    // For each record, save individually to trigger the pre-save hook for `availability` calculation
    for (const data of inventoryData) {
      const inv = new Inventory(data);
      await inv.save();
    }
    
    console.log(`Inserted ${inventoryData.length} inventory records with availability calculated.`);

    // Create Admin User
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const adminUser = new User({
        name: 'System Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'ADMIN'
      });
      await adminUser.save();
      console.log('Admin user created successfully.');
    }

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedDB();
