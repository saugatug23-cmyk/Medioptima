const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const medicinesData = [
  {
    name: "Dolo 650",
    genericName: "Paracetamol",
    brandName: "Micro Labs",
    activeIngredient: "Paracetamol",
    strength: "650mg",
    dosageForm: "Tablet",
    manufacturer: "Micro Labs Ltd",
    category: "Analgesics/Antipyretics",
    prescriptionRequired: false,
    description: "Used for fever and mild to moderate pain.",
    price: 30.50,
    currency: "INR",
    searchableAliases: ["crocin", "fever", "headache", "tylenol"],
    source: "Initial Import",
    sourceId: "DOLO-001"
  },
  {
    name: "Augmentin 625 Duo",
    genericName: "Amoxicillin and Clavulanic Acid",
    brandName: "GSK",
    activeIngredient: "Amoxicillin + Clavulanic Acid",
    strength: "625mg",
    dosageForm: "Tablet",
    manufacturer: "GlaxoSmithKline Pharmaceuticals Ltd",
    category: "Antibiotic",
    prescriptionRequired: true,
    description: "Used to treat various bacterial infections.",
    price: 201.20,
    currency: "INR",
    searchableAliases: ["amox", "antibiotic", "infection"],
    source: "Initial Import",
    sourceId: "AUG-001"
  }
];

async function testMedicineFlow() {
  try {
    console.log('1. Admin Login');
    const adminRes = await axios.post(API_URL + '/auth/login', { email: 'admin@medioptima.com', password: 'Admin@12345' });
    const adminToken = adminRes.data.data.token;
    
    console.log('2. Admin imports medicines via POST /api/medicines/import');
    const importRes = await axios.post(API_URL + '/medicines/import', { medicines: medicinesData }, { headers: { Authorization: 'Bearer ' + adminToken } });
    console.log('Import successful. Total imported:', importRes.data.data.successful);

    console.log('3. Admin fetches medicines');
    let allMedsRes = await axios.get(API_URL + '/medicines', { headers: { Authorization: 'Bearer ' + adminToken } });
    let meds = allMedsRes.data.data.medicines;
    console.log('Fetched ' + meds.length + ' medicines');

    const firstMedId = meds[0]._id;

    console.log('4. Admin searches for medicine by searchableAlias (e.g., "crocin")');
    const searchRes = await axios.get(API_URL + '/medicines?search=crocin', { headers: { Authorization: 'Bearer ' + adminToken } });
    console.log('Search matches:', searchRes.data.data.medicines.map(m => m.name));
    
    console.log('5. Admin updates a medicine price');
    const updateRes = await axios.put(API_URL + '/medicines/' + firstMedId, { price: 50.0 }, { headers: { Authorization: 'Bearer ' + adminToken } });
    console.log('Updated price:', updateRes.data.data.medicine.price);

    console.log('6. Patient Flow');
    const patientLoginRes = await axios.post(API_URL + '/auth/register', {
      name: 'Test Patient 2',
      email: 'testpat2@example.com',
      password: 'Password123!',
      phone: '1234567890'
    });
    const patientToken = patientLoginRes.data.data.token;

    console.log('7. Patient tries to update a medicine (Should Fail)');
    try {
      await axios.put(API_URL + '/medicines/' + firstMedId, { price: 10 }, { headers: { Authorization: 'Bearer ' + patientToken } });
      console.log('✘ FAIL: Patient was able to update a medicine');
      process.exit(1);
    } catch(err) {
      if (err.response && err.response.status === 403) {
        console.log('✔ Patient blocked with 403 Forbidden as expected');
      } else {
        console.log('Unexpected error status:', err.response?.status);
        process.exit(1);
      }
    }

    console.log('8. Patient searches for a medicine (Should Succeed)');
    const patientSearch = await axios.get(API_URL + '/medicines?search=augmentin', { headers: { Authorization: 'Bearer ' + patientToken } });
    console.log('Patient search found:', patientSearch.data.data.medicines.map(m => m.name));

    console.log('===============================');
    console.log('ALL TESTS PASSED SUCCESSFULLY');
    console.log('===============================');

  } catch (error) {
    console.error('Test Failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testMedicineFlow();
