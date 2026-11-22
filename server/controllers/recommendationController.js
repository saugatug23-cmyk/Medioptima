const recommendationService = require('../services/recommendationService');

exports.getRecommendations = async (req, res, next) => {
  try {
    const { medicineId } = req.params;
    const { qty } = req.query;

    if (!medicineId) {
      return res.status(400).json({
        status: 'fail',
        message: 'medicineId is required'
      });
    }

    const recommendations = await recommendationService.getRecommendations(medicineId, qty);

    res.status(200).json({
      status: 'success',
      data: recommendations
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    if (error.message === 'Requested medicine not found') {
      return res.status(404).json({
        status: 'fail',
        message: error.message
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch recommendations'
    });
  }
};
