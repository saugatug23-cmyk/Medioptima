const fs = require('fs');

let content = fs.readFileSync('server/controllers/authController.js', 'utf8');

// Use string split or regex to replace everything after exports.googleLogin
const splitMarker = 'exports.googleLogin = asyncHandler(async (req, res, next) => {';
if (content.includes(splitMarker)) {
  const parts = content.split(splitMarker);
  const before = parts[0];
  
  const newGoogleLogin = `
const { createClient } = require('@supabase/supabase-js');

exports.googleLogin = asyncHandler(async (req, res, next) => {
  const { credential } = req.body;
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
`;

  fs.writeFileSync('server/controllers/authController.js', before + newGoogleLogin);
}
