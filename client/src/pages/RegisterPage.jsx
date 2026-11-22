import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../config/supabase';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const navigate = useNavigate();
  const { register, googleLogin, isAuthenticated, currentUser } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  React.useEffect(() => {
    if (isAuthenticated && currentUser) {
      navigate(currentUser.role === 'ADMIN' ? '/admin/dashboard' : currentUser.role === 'PHARMACY' ? '/pharmacy/dashboard' : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate]);

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
          redirectTo: window.location.origin + '/register'
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
    // If the user lands here with a token, we could handle it, 
    // but the callback redirects to /login usually. We just keep it clean.
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const user = await register(formData);
        
        if (user) {
          navigate(user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'PHARMACY' ? '/pharmacy/dashboard' : '/dashboard', { replace: true });
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-[540px] bg-white rounded-[20px] shadow-elevated p-6 sm:p-10 border border-gray-100">
        
        {/* Logo Header */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="inline-flex cursor-pointer hover:opacity-90 transition-opacity" aria-label="Go to MediOptima homepage">
            <img src="/logo.png" alt="MediOptima Logo" className="h-10 w-auto object-contain" />
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-[32px] font-semibold tracking-tight text-[var(--color-text-primary)]">Create your account</h2>
          <p className="mt-2 text-[15px] text-[var(--color-text-secondary)]">
            Join MediOptima and make finding your medicines easier.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3.5 rounded-[12px] bg-[var(--color-warning-bg)] border border-[var(--color-warning)]/20 text-[var(--color-warning)] text-[14px] font-medium flex items-center gap-2">
              <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
          
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[var(--color-text-primary)] block">Full Name</label>
              <Input
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="bg-white focus:bg-white h-[50px] rounded-[10px] border-gray-200 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] shadow-sm w-full text-[15px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[var(--color-text-primary)] block">Email address</label>
              <Input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="bg-white focus:bg-white h-[50px] rounded-[10px] border-gray-200 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] shadow-sm w-full text-[15px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[var(--color-text-primary)] block">Phone Number</label>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number (optional)"
                className="bg-white focus:bg-white h-[50px] rounded-[10px] border-gray-200 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] shadow-sm w-full text-[15px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-[var(--color-text-primary)] block">Password</label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    className="pr-10 bg-white focus:bg-white h-[50px] rounded-[10px] border-gray-200 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] shadow-sm w-full text-[15px]"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[var(--color-primary)] transition-colors focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-[var(--color-text-primary)] block">Confirm Password</label>
                <Input
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="bg-white focus:bg-white h-[50px] rounded-[10px] border-gray-200 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] shadow-sm w-full text-[15px]"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-[50px] rounded-[10px] text-[16px] font-semibold shadow-sm hover:shadow mt-2" disabled={isLoading || isGoogleLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-[12px] uppercase">
              <span className="bg-white px-3 text-gray-400 font-semibold tracking-wider">Or</span>
            </div>
          </div>

          <Button 
            type="button"
            variant="outline"
            className="w-full h-[50px] rounded-[10px] bg-white border-gray-200 hover:bg-gray-50 text-gray-700 text-[16px] font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
            onClick={() => handleGoogleAuth()}
            disabled={isLoading || isGoogleLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {isGoogleLoading ? 'Connecting...' : 'Sign up with Google'}
          </Button>
        </form>

        <p className="text-center text-[15px] text-[var(--color-text-secondary)] pt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
