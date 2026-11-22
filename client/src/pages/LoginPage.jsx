import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Eye, EyeOff, Loader2, Mail, Lock, AlertTriangle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../config/supabase';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { login, googleLogin, isAuthenticated, currentUser } = useAuth();

  const handleGoogleAuth = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase configuration is missing.');
      return;
    }
    try {
      setIsGoogleLoading(true);
      setError('');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/login'
        }
      });
      
      if (error) {
        if (error.message && (error.message.toLowerCase().includes('cancel') || error.message.toLowerCase().includes('closed'))) {
          setError('Google sign-in was cancelled.');
        } else if (error.message && (error.message.toLowerCase().includes('fetch') || error.message.toLowerCase().includes('network'))) {
          setError('Unable to connect to authentication service.');
        } else {
          setError(error.message);
        }
      }
    } catch (err) {
      console.error('Google login error:', err);
      if (err.message && (err.message.toLowerCase().includes('fetch') || err.message.toLowerCase().includes('network'))) {
        setError('Unable to connect to authentication service.');
      } else {
        setError('An error occurred during Google sign-in');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  React.useEffect(() => {
    if (!supabase) return;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsGoogleLoading(true);
        try {
          const user = await googleLogin(session.access_token);
          if (user) {
            navigate(user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'PHARMACY' ? '/pharmacy/dashboard' : '/dashboard', { replace: true });
          } else {
            setError('Google sign-in failed. Please try again.');
          }
        } catch (err) {
          console.error('Google sync error:', err);
          setError(err.response?.data?.message || 'Failed to synchronize with server.');
        } finally {
          setIsGoogleLoading(false);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [googleLogin, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(email, password);
      if (user) {
        navigate(user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'PHARMACY' ? '/pharmacy/dashboard' : '/dashboard', { replace: true });
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      if (!err.response) {
        setError('Unable to connect to the server. Please try again.');
      } else if (err.response.status === 401 || err.response.status === 403) {
        setError('Email or password is incorrect.');
      } else if (err.response.status >= 500) {
        setError('The server could not access the database.');
      } else if (err.response.status === 400 || err.response.status === 422) {
        setError(err.response.data?.message || 'Invalid input provided.');
      } else {
        setError(err.response.data?.message || 'An error occurred during login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-[480px] bg-white rounded-[20px] shadow-sm p-8 sm:p-10 border border-gray-100">
        
        {/* Logo Header */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="inline-flex cursor-pointer hover:opacity-90 transition-opacity">
            <img src="/logo.png" alt="MediOptima Logo" className="h-10 w-auto object-contain" />
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-[32px] font-bold tracking-tight text-gray-900 mb-2">Sign In</h2>
          <p className="text-[15px] text-gray-600 font-medium">
            Welcome back! Please sign in to your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 rounded-[12px] bg-red-50 border border-red-100 text-red-600 text-[14px] font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="bg-white focus:bg-white h-[50px] pl-10 rounded-[10px] border-gray-200 focus:border-[#047857] focus:ring-1 focus:ring-[#047857] w-full text-[15px]"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="bg-white focus:bg-white h-[50px] pl-10 pr-12 rounded-[10px] border-gray-200 focus:border-[#047857] focus:ring-1 focus:ring-[#047857] w-full text-[15px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#047857] focus:ring-[#047857]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-[14px] font-medium text-gray-900">
                Remember me
              </label>
            </div>
            
            <div className="text-[14px]">
              <button type="button" onClick={(e) => { e.preventDefault(); setError("Password reset is not yet implemented."); }} className="font-semibold text-[#047857] hover:underline">
                Forgot password?
              </button></div></div><Button type="submit" 
            className="w-full h-[50px] text-[16px] font-semibold bg-[#047857] hover:bg-[#065f46] text-white rounded-[10px] shadow-sm mt-2"
            disabled={isLoading || isGoogleLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="mt-8 mb-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-[13px]">
            <span className="bg-white px-4 text-gray-500 font-medium">or continue with</span>
          </div>
        </div>

        {/* Social Auth */}
        <div className="grid grid-cols-1 gap-4">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); handleGoogleAuth(); }}
            disabled={isLoading || isGoogleLoading}
            className="flex items-center justify-center w-full h-[46px] rounded-[10px] border border-gray-200 bg-white px-4 py-2 text-[14px] font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
          >
            {isGoogleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-2" />
            )}
            Sign in with Google
          </button>
        </div>

        {/* Footer Text */}
        <p className="text-center text-[15px] text-gray-600 mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-[#047857] hover:underline">
            Get started
          </Link>
        </p>
      </div>
    </div>
  );
}