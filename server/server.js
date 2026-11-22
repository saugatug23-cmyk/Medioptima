const app = require('./app');
const connectDB = require('./config/db');
const shortagePredictionService = require('./services/shortagePredictionService');
const deliveryTimeService = require('./services/deliveryTimeService');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  // Train the ML model on startup
  shortagePredictionService.trainModel().catch(err => {
    console.error('Failed to train prediction model:', err);
  });
  deliveryTimeService.trainModel().catch(err => {
    console.error('Failed to train delivery model:', err);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
