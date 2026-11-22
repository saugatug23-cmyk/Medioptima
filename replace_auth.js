const fs = require('fs');

let content = fs.readFileSync('server/controllers/authController.js', 'utf8');

// Remove google-auth-library import
content = content.replace(/const\s+\{\s*OAuth2Client\s*\}\s*=\s*require\('google-auth-library'\);\s*const\s+googleClient\s*=\s*new\s*OAuth2Client\(process\.env\.GOOGLE_CLIENT_ID\);/, '');

// Replace googleLogin
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

    // Must be a Google login (or we just accept any valid Supabase user that comes via Google)
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

content = content.replace(/exports\.googleLogin\s*=\s*asyncHandler\(async\s*\(req,\s*res,\s*next\)\s*=>\s*\{[\s\S]*?(?=exports\.register\s*=)/, newGoogleLogin);

fs.writeFileSync('server/controllers/authController.js', content);
