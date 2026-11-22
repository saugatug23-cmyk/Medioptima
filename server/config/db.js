const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Global reference so we don't start multiple instances in the same process
let mongoServer = null;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    if (uri && (uri.includes('127.0.0.1') || uri.includes('localhost'))) {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const dbPath = path.join(__dirname, '../.mongo_data');
        
        // Start memory server on standard port with persistent storage
        if (!mongoServer) {
          mongoServer = await MongoMemoryServer.create({
            instance: { 
              port: 27017,
              dbPath: dbPath,
              storageEngine: 'wiredTiger'
            }
          });
          console.log('MongoDB Memory Server started locally on port 27017 with persistent storage.');
        }
      } catch (err) {
        console.warn('MongoMemoryServer notice:', err.message);
      }
    }

    if (!uri) {
      console.warn('MONGODB_URI is not provided in environment variables.');
      return false;
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    return false;
  }
};

module.exports = connectDB;
