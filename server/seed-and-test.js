const mongoose = require('mongoose');
const User = require('./models/User');
const Pharmacy = require('./models/Pharmacy');
const Inventory = require('./models/Inventory');
const Medicine = require('./models/Medicine');
const axios = require('axios');
const bcrypt = require('bcryptjs');

const API_URL = 'http://localhost:5000/api';

async function runSeedAndTest() {
  await mongoose.connect('mongodb://localhost:27017/medioptima');
  console.log('Connected to DB');

  await Pharmacy.deleteMany({ name: { $regex: /Dev/ } });
  await User.deleteMany({ email: { $regex: /pharma/ } });

  console.log('1. Ensure Medicines Exist');
  let paraMed = await Medicine.findOne({ genericName: 'Paracetamol' });
  if(!paraMed) {
    paraMed = await Medicine.create({ name: 'Paracetamol 500mg', genericName: 'Paracetamol', strength: '500mg', dosageForm: 'Tablet', price: 30, currency: 'INR' });
  }
  let cetiMed = await Medicine.findOne({ genericName: 'Cetirizine' });
  if(!cetiMed) {
    cetiMed = await Medicine.create({ name: 'Cetirizine 10mg', genericName: 'Cetirizine', strength: '10mg', dosageForm: 'Tablet', price: 15, currency: 'INR' });
  }

  console.log('2. Admin Creating Pharmacies');
  const pA = await Pharmacy.create({ name: "Pharmacy A (Dev)", address: "123 North St", city: "Bangalore", state: "KA", pincode: "560001", latitude: 12.971, longitude: 77.594, isActive: true, isOpen: true });
  const pB = await Pharmacy.create({ name: "Pharmacy B (Dev)", address: "456 South St", city: "Bangalore", state: "KA", pincode: "560002", latitude: 12.972, longitude: 77.595, isActive: true, isOpen: true });
  const pC = await Pharmacy.create({ name: "Pharmacy C (Dev)", address: "789 East St", city: "Bangalore", state: "KA", pincode: "560003", latitude: 12.973, longitude: 77.596, isActive: true, isOpen: true });

  console.log('3. Admin Creating Pharmacy Users');
  
  const uA = await User.create({ name: 'Admin A', email: 'pharmaA@dev.com', password: 'Password123!', role: 'PHARMACY', pharmacyId: pA._id });
  const uB = await User.create({ name: 'Admin B', email: 'pharmaB@dev.com', password: 'Password123!', role: 'PHARMACY', pharmacyId: pB._id });

  // Generate tokens for A and B
  const loginA = await axios.post(API_URL + '/auth/login', { email: 'pharmaA@dev.com', password: 'Password123!' });
  const tokenA = loginA.data.data.token;
  
  const loginB = await axios.post(API_URL + '/auth/login', { email: 'pharmaB@dev.com', password: 'Password123!' });
  const tokenB = loginB.data.data.token;

  console.log('4. PHARMACY A sets inventory via API');
  await axios.post(API_URL + '/inventory', { medicineId: paraMed._id, availableQuantity: 25, price: 32 }, { headers: { Authorization: 'Bearer ' + tokenA } });
  await axios.post(API_URL + '/inventory', { medicineId: cetiMed._id, availableQuantity: 10, price: 15 }, { headers: { Authorization: 'Bearer ' + tokenA } });

  console.log('5. PHARMACY B sets inventory via API');
  await axios.post(API_URL + '/inventory', { medicineId: paraMed._id, availableQuantity: 3, price: 30 }, { headers: { Authorization: 'Bearer ' + tokenB } });
  await axios.post(API_URL + '/inventory', { medicineId: cetiMed._id, availableQuantity: 0, price: 15 }, { headers: { Authorization: 'Bearer ' + tokenB } });

  console.log('6. Setup Pharmacy C directly in DB');
  await Inventory.create({ pharmacy: pC._id, medicine: paraMed._id, availableQuantity: 0, price: 31, isActive: true });
  await Inventory.create({ pharmacy: pC._id, medicine: cetiMed._id, availableQuantity: 20, price: 16, isActive: true });

  console.log('7. SECURITY TEST: Pharmacy A attempts to modify Pharmacy B inventory');
  const invB = await Inventory.findOne({ pharmacy: pB._id });
  try {
    await axios.put(API_URL + '/inventory/' + invB._id, { availableQuantity: 999 }, { headers: { Authorization: 'Bearer ' + tokenA } });
    console.log('âœ˜ FAIL: Pharmacy A modified Pharmacy B');
  } catch (err) {
    if (err.response && err.response.status === 403) {
      console.log('âœ” PASS: Pharmacy A blocked from modifying Pharmacy B (403)');
    } else {
      console.log('Unexpected Error:', err.response?.status);
    }
  }

  console.log('8. SECURITY TEST: Normal user attempts inventory API');
  await User.deleteMany({ email: 'pat123@dev.com' }); const uPatient = await User.create({ name: 'Pat', email: 'pat123@dev.com', password: 'Password123!', role: 'PATIENT' });
  const loginPat = await axios.post(API_URL + '/auth/login', { email: 'pat123@dev.com', password: 'Password123!' });
  try {
    await axios.post(API_URL + '/inventory', { medicineId: paraMed._id, availableQuantity: 5, price: 30 }, { headers: { Authorization: 'Bearer ' + loginPat.data.data.token } });
    console.log('âœ˜ FAIL: Patient modified inventory');
  } catch (err) {
    if (err.response && (err.response.status === 403 || err.response.status === 401)) {
      console.log('âœ” PASS: Patient blocked from inventory API (' + err.response.status + ')');
    }
  }
  
  console.log('9. USER Searches Paracetamol 500mg, Quantity=5');
  const searchRes = await axios.post(API_URL + '/search', {
    medicines: [{ id: paraMed._id, quantity: 5 }]
  }, { headers: { Authorization: 'Bearer ' + loginPat.data.data.token } });
  
  const pharmResults = searchRes.data.data.pharmacies;
  
  const resA = pharmResults.find(p => p.name === 'Pharmacy A (Dev)');
  const resB = pharmResults.find(p => p.name === 'Pharmacy B (Dev)');
  const resC = pharmResults.find(p => p.name === 'Pharmacy C (Dev)');

  console.log(`Pharmacy A: ${resA?.medicines[0]?.availability} (Available: ${resA?.medicines[0]?.availableQuantity})`);
  console.log(`Pharmacy B: ${resB?.medicines[0]?.availability} (Available: ${resB?.medicines[0]?.availableQuantity})`);
  console.log(`Pharmacy C: ${resC?.medicines[0]?.availability} (Available: ${resC?.medicines[0]?.availableQuantity})`);

  if (resA?.medicines[0]?.availability === 'Fully available' && resB?.medicines[0]?.availability === 'Partially available' && resC?.medicines[0]?.availability === 'Not available') {
    console.log('âœ” PASS: Search Engine returned exact expected stock availability');
  } else {
    console.log('âœ˜ FAIL: Search Engine stock availability did not match prompt requirements');
  }

  process.exit(0);
}
runSeedAndTest();
