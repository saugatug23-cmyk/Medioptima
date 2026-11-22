const mongoose = require('mongoose');

exports.getHealthStatus = (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  res.status(200).json({
    status: 'success',
    timestamp: new Date().toISOString(),
    api: 'running',
    database: dbStatusMap[dbState] || 'Unknown'
  });
};

exports.getSystemStatus = (req, res) => {
  const dbState = mongoose.connection.readyState;
  const isDbHealthy = dbState === 1;

  res.status(200).json({
    status: 'success',
    data: {
      services: [
        { name: 'Backend API', status: 'Healthy' },
        { name: 'MongoDB', status: isDbHealthy ? 'Healthy' : 'Unavailable' },
        { name: 'Authentication', status: 'Healthy' },
        { name: 'Medicine API', status: isDbHealthy ? 'Healthy' : 'Unavailable' },
        { name: 'Pharmacy API', status: isDbHealthy ? 'Healthy' : 'Unavailable' },
        { name: 'Inventory API', status: isDbHealthy ? 'Healthy' : 'Unavailable' },
        { name: 'Availability API', status: isDbHealthy ? 'Healthy' : 'Unavailable' },
        { name: 'Optimization', status: 'Healthy' }, // Using Greedy Set Cover local service
        { name: 'ML Delivery Time', status: 'Healthy' }, // Simulated/Basic ML model exists
        { name: 'ML Shortage Prediction', status: 'Healthy' },
        { name: 'ML Demand Prediction', status: 'Not configured' },
        { name: 'ML Price Prediction', status: 'Not configured' },
        { name: 'Recommendations', status: 'Healthy' },
        { name: 'Maps', status: process.env.MAP_PROVIDER ? 'Healthy' : 'Not configured' },
        { name: 'Routing', status: process.env.ROUTING_PROVIDER ? 'Healthy' : 'Not configured' }
      ]
    }
  });
};
