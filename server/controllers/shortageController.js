const shortagePredictionService = require('../services/shortagePredictionService');

exports.predictShortage = async (req, res, next) => {
  try {
    const { pharmacyId, medicineId } = req.body;

    if (!pharmacyId || !medicineId) {
      return res.status(400).json({
        status: 'fail',
        message: 'pharmacyId and medicineId are required'
      });
    }

    const prediction = await shortagePredictionService.predictShortage(pharmacyId, medicineId);

    if (prediction.error) {
      return res.status(200).json({
        status: 'success',
        data: {
          prediction: {
            hasData: false,
            message: 'Not enough history to predict shortage.'
          }
        }
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        prediction
      }
    });

  } catch (error) {
    console.error('Shortage prediction error:', error);
    next(error);
  }
};

exports.train = async (req, res, next) => {
  try {
    await shortagePredictionService.trainModel();
    res.status(200).json({ status: 'success', message: 'Trained' });
  } catch (err) {
    next(err);
  }
};
