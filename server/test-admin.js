const axios = require('axios');
const assert = require('assert');

const API_URL = 'http://localhost:5000/api';

async function testAdminFlow() {
  try {
    console.log('1. Testing Admin Login...');
    const adminLoginRes = await axios.post(API_URL + '/auth/login', {
      email: 'admin@medioptima.com',
      password: 'Admin@12345'
    });
    const adminToken = adminLoginRes.data.data.token;
    assert.strictEqual(adminLoginRes.data.data.user.role, 'ADMIN', 'Role should be ADMIN');
    console.log('✔ Admin Login passed (Token received)');

    console.log('2. Testing Protected Admin API with Admin Token...');
    const adminReq = await axios.get(API_URL + '/users', {
      headers: { Authorization: 'Bearer ' + adminToken }
    });
    assert.strictEqual(adminReq.data.success, true, 'Admin API should succeed');
    console.log('✔ Admin API Access passed');

    console.log('3. Testing Non-Admin access to Admin API...');
    const patientLoginRes = await axios.post(API_URL + '/auth/register', {
      name: 'Test Patient',
      email: 'test' + Date.now() + '@example.com',
      password: 'Password123!',
      phone: '1234567890'
    });
    const patientToken = patientLoginRes.data.data.token;
    assert.strictEqual(patientLoginRes.data.data.user.role, 'PATIENT', 'Role should be PATIENT');

    try {
      await axios.get(API_URL + '/users', {
        headers: { Authorization: 'Bearer ' + patientToken }
      });
      console.log('✘ Non-Admin should have been denied!');
      process.exit(1);
    } catch(err) {
      assert.strictEqual(err.response.status, 403, 'Should get 403 Forbidden');
      console.log('✔ Non-Admin access denied properly');
    }

    console.log('=============================');
    console.log('ALL ADMIN E2E TESTS PASSED!');
    console.log('=============================');
  } catch(e) {
    console.error('Test Failed!');
    console.error(e.response ? e.response.data : e.message);
    process.exit(1);
  }
}
testAdminFlow();
