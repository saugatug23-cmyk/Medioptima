const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select('-password -__v');

  res.status(200).json({
    success: true,
    data: users,
  });
});

exports.updateUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;

  if (!['PATIENT', 'ADMIN'].includes(role)) {
    return next(new AppError('Invalid role specified', 400));
  }

  // Prevent admin from removing the last admin (basic check)
  if (role === 'PATIENT') {
    const userToUpdate = await User.findById(req.params.id);
    if (userToUpdate.role === 'ADMIN') {
      const adminCount = await User.countDocuments({ role: 'ADMIN' });
      if (adminCount <= 1) {
        return next(new AppError('Cannot change the role of the only administrator', 400));
      }
    }
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});
