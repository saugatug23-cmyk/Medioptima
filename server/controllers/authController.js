const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id, user.role);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    message,
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
};

exports.register = asyncHandler(async (req, res, next) => {
  // Extract only allowed fields, force role to PATIENT
  const { name, email, password, phone } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    phone,
    role: 'PATIENT',
  });

  createSendToken(newUser, 201, res, 'Registration successful');
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res, 'Login successful');
});

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location
      }
    },
  });
});




const { createClient } = require('@supabase/supabase-js');

exports.googleLogin = asyncHandler(async (req, res, next) => {
  const { credential, mode = 'login' } = req.body;
  if (!credential) {
    return next(new AppError('No Supabase access token provided', 400));
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      return next(new AppError('Supabase configuration missing on server', 500));
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: { user }, error } = await supabase.auth.getUser(credential);
    
    if (error || !user) {
      return next(new AppError('Invalid or expired Supabase token', 401));
    }

    const email = user.email;
    const name = user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0];

    // Find or create user
    let appUser = await User.findOne({ email });

    if (appUser) {
      // Link if not linked
      if (!appUser.supabaseUserId) {
        appUser.supabaseUserId = user.id;
        appUser.authProvider = 'google';
        await appUser.save({ validateBeforeSave: false });
      }
    } else {
        if (mode !== 'register') {
          return next(new AppError('No account found. Please register first.', 404));
        }
        // Create new user (Role stays 'PATIENT' default)
        appUser = await User.create({
        name,
        email,
        authProvider: 'google',
        supabaseUserId: user.id
      });
    }

    createSendToken(appUser, 200, res);
  } catch (error) {
    console.error('Google sync error:', error);
    next(new AppError('Failed to synchronize Google user', 500));
  }
});
