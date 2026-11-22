const routingService = require('../services/routingService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.calculateRoute = asyncHandler(async (req, res, next) => {
  const { origin, destinations } = req.body;

  if (!origin || !origin.lat || !origin.lng) {
    return next(new AppError('Please provide a valid origin {lat, lng}', 400));
  }
  
  if (!destinations || !Array.isArray(destinations) || destinations.length === 0) {
    return next(new AppError('Please provide an array of destinations', 400));
  }

  const routeData = await routingService.calculateRoute(origin, destinations);

  res.status(200).json({
    status: 'success',
    data: {
      route: routeData
    }
  });
});
