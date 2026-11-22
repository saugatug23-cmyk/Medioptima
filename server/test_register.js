const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./app');
const request = require('http');

(async () => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri);
  console.log('Connected to mock MongoDB');

  const server = app.listen(5001, () => {
    console.log('Test server running on port 5001');
    
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
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', async () => {
        console.log('STATUS:', res.statusCode);
        console.log('RESPONSE:', data);
        await mongoose.disconnect();
        await mongoServer.stop();
        server.close();
        process.exit(0);
      });
    });

    req.write(postData);
    req.end();
  });
})();
