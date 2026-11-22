const deliveryTimeService = require('../services/deliveryTimeService');

exports.predictDeliveryTime = async (req, res, next) => {
  try {
    const { pharmacyId, location } = req.body;

    if (!pharmacyId || !location || !location.lat || !location.lon) {
      return res.status(400).json({
        status: 'fail',
        message: 'pharmacyId and valid location (lat, lon) are required'
      });
    }

    const prediction = await deliveryTimeService.predictDeliveryTime(pharmacyId, location);

    if (prediction.error) {
      return res.status(503).json({
        status: 'fail',
        message: prediction.error
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        estimatedMinutes: prediction.estimatedMinutes
      }
    });

  } catch (error) {
    console.error('Delivery prediction error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to predict delivery time'
    });
  }
};
