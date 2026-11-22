const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testRealFlow() {
  try {
    console.log('1. Admin Login');
    const adminRes = await axios.post(API_URL + '/auth/login', { email: 'admin@medioptima.com', password: 'Admin@12345' });
    const adminToken = adminRes.data.data.token;
    
    // First, let's create the two medicines if they don't exist
    console.log('2. Admin ensures medicines exist');
    let allMedsRes = await axios.get(API_URL + '/medicines', { headers: { Authorization: 'Bearer ' + adminToken } });
    let meds = allMedsRes.data.data.medicines;
    
    let paracetamolId, cetirizineId;
    const paraMed = meds.find(m => m.name.includes('Dolo 650') || m.genericName.includes('Paracetamol'));
    if (!paraMed) {
      console.log('Importing missing Paracetamol/Dolo...');
      await axios.post(API_URL + '/medicines/import', { medicines: [{
        name: "Paracetamol 500mg", genericName: "Paracetamol", strength: "500mg", dosageForm: "Tablet", price: 30, currency: "INR"
      }]}, { headers: { Authorization: 'Bearer ' + adminToken } });
    }
    const cetiMed = meds.find(m => m.genericName.includes('Cetirizine'));
    if (!cetiMed) {
      console.log('Importing missing Cetirizine...');
      await axios.post(API_URL + '/medicines/import', { medicines: [{
        name: "Cetirizine 10mg", genericName: "Cetirizine", strength: "10mg", dosageForm: "Tablet", price: 15, currency: "INR"
      }]}, { headers: { Authorization: 'Bearer ' + adminToken } });
    }

    allMedsRes = await axios.get(API_URL + '/medicines', { headers: { Authorization: 'Bearer ' + adminToken } });
    meds = allMedsRes.data.data.medicines;
    paracetamolId = meds.find(m => m.genericName.includes('Paracetamol'))._id;
    cetirizineId = meds.find(m => m.genericName.includes('Cetirizine'))._id;

    console.log('3. Admin Creates Pharmacies');
    const pharmA = await axios.post(API_URL + '/pharmacies', {
      name: "Pharmacy A (Dev)", address: "123 North St", city: "Bangalore", state: "KA", pincode: "560001", latitude: 12.971, longitude: 77.594
    }, { headers: { Authorization: 'Bearer ' + adminToken } });
    
    const pharmB = await axios.post(API_URL + '/pharmacies', {
      name: "Pharmacy B (Dev)", address: "456 South St", city: "Bangalore", state: "KA", pincode: "560002", latitude: 12.972, longitude: 77.595
    }, { headers: { Authorization: 'Bearer ' + adminToken } });

    const pharmC = await axios.post(API_URL + '/pharmacies', {
      name: "Pharmacy C (Dev)", address: "789 East St", city: "Bangalore", state: "KA", pincode: "560003", latitude: 12.973, longitude: 77.596
    }, { headers: { Authorization: 'Bearer ' + adminToken } });

    const pA = pharmA.data.data.pharmacy._id;
    const pB = pharmB.data.data.pharmacy._id;
    const pC = pharmC.data.data.pharmacy._id;

    console.log('4. Admin Creates Pharmacy Users');
    // Using standard user creation, but forcing role directly since we can't do it via register API if it's restricted, wait, register API doesn't allow setting role usually.
    // I will write a quick script logic to register and then admin updates them, OR directly use MongoDB.
    // Let's create an Admin user endpoint or just update MongoDB directly to assign PHARMACY role.
  } catch(e) {
    console.error(e.response?.data || e.message);
  }
}
testRealFlow();
