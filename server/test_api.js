const axios = require('axios');

async function testApi() {
  try {
    const loginRes = await axios.post('http://127.0.0.1:5000/api/auth/login', {
      email: 'admin@medioptima.com',
      password: 'Admin@12345'
    });
    
    const token = loginRes.data.token || (loginRes.data.data && loginRes.data.data.token);
    
    const res = await axios.post('http://127.0.0.1:5000/api/search', {
      medicines: [{ id: '6aa2eb80c126b16fa362bc57', quantity: 5 }],
      location: { lat: 24.819, lng: 92.793 }
    }, {
      headers: { Authorization: 'Bearer ' + token }
    });
    
    // Check Apollo
    const apollo = res.data.data.pharmacies.find(p => p.name.includes('Apollo Pharmacy Silchar ONGC'));
    console.log("Apollo Pharmacy Result:");
    console.log(JSON.stringify(apollo, null, 2));
  } catch(e) {
    console.error(e.response ? e.response.data : e.message);
  }
}
testApi();