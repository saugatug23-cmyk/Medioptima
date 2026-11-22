require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    let admin = await User.findOne({ email: 'admin@medioptima.com' });
    if (admin) {
      admin.password = 'Admin@12345';
      admin.role = 'ADMIN';
      await admin.save();
      console.log('Admin user updated.');
    } else {
      admin = new User({
        name: 'System Admin',
        email: 'admin@medioptima.com',
        password: 'Admin@12345',
        role: 'ADMIN'
      });
      await admin.save();
      console.log('Admin user created.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
});
