const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./app');
const request = require('http');
const User = require('./models/User');

(async () => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri);
  console.log('Connected to mock MongoDB');

  const server = app.listen(5001, () => {
    console.log('Test server running on port 5001');
    
    // Register
    const postData = JSON.stringify({
      name: 'Test Patient',
      email: 'unique-test-user@example.com',
      password: 'TestPassword123!',
      phone: '9876543210'
    });

    const options = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = request.request(options, (res) => {
      res.on('data', () => {});
      res.on('end', () => {
        // Now Login
        const loginData = JSON.stringify({
          email: 'unique-test-user@example.com',
          password: 'TestPassword123!'
        });
        
        const loginOptions = {
          hostname: 'localhost',
          port: 5001,
          path: '/api/auth/login',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(loginData)
          }
        };

        const loginReq = request.request(loginOptions, (loginRes) => {
          let ldata = '';
          loginRes.on('data', c => ldata += c);
          loginRes.on('end', async () => {
             console.log('LOGIN STATUS:', loginRes.statusCode);
             console.log('LOGIN RESPONSE:', ldata);
             await mongoose.disconnect();
             await mongoServer.stop();
             server.close();
             process.exit(0);
          });
        });
        loginReq.write(loginData);
        loginReq.end();
      });
    });

    req.write(postData);
    req.end();
  });
})();
