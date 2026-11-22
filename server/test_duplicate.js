const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./app');
const request = require('http');

(async () => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri);

  const server = app.listen(5002, () => {
    const postData = JSON.stringify({
      name: 'Test Patient',
      email: 'duplicate@example.com',
      password: 'TestPassword123!',
      phone: '9876543210'
    });

    const options = {
      hostname: 'localhost',
      port: 5002,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req1 = request.request(options, (res1) => {
      res1.on('data', () => {});
      res1.on('end', () => {
        // Run again for duplicate
        const req2 = request.request(options, (res2) => {
          let data = '';
          res2.on('data', c => data += c);
          res2.on('end', async () => {
            console.log('DUPLICATE STATUS:', res2.statusCode);
            console.log('DUPLICATE RESPONSE:', data);
            await mongoose.disconnect();
            await mongoServer.stop();
            server.close();
            process.exit(0);
          });
        });
        req2.write(postData);
        req2.end();
      });
    });

    req1.write(postData);
    req1.end();
  });
})();
