const axios = require('axios');
async function testSync() {
  try {
    const res = await axios.post('http://127.0.0.1:5000/api/auth/google', {
      credential: 'fake_supabase_token'
    });
    console.log(res.data);
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
  }
}
testSync();