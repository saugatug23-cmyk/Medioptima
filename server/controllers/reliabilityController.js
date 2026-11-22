const reliabilityService = require('../services/reliabilityService');

exports.getPharmacyReliability = async (req, res, next) => {
  try {
    const { pharmacyId } = req.params;

    if (!pharmacyId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Pharmacy ID is required'
      });
    }

    const reliabilityData = await reliabilityService.calculateReliability(pharmacyId);

    res.status(200).json({
      status: 'success',
      data: reliabilityData
    });
  } catch (error) {
    console.error('Reliability error:', error);
    if (error.message === 'Pharmacy not found') {
      return res.status(404).json({
        status: 'fail',
        message: 'Pharmacy not found'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to calculate reliability score'
    });
  }
};
