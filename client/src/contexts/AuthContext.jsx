import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user on mount or token change
  useEffect(() => {
    let isMounted = true;
    
    const loadUser = async () => {
      if (!token) {
        if (isMounted) {
          setIsAuthenticated(false);
          setCurrentUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await authAPI.getMe();
        if (isMounted) {
          setCurrentUser(response.data.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Failed to authenticate:', err);
        localStorage.removeItem('token');
        if (isMounted) {
          setToken(null);
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Handle global 401s
  useEffect(() => {
    const handleAuthError = () => {
      setToken(null);
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
    };

    window.addEventListener('auth-error', handleAuthError);
    return () => window.removeEventListener('auth-error', handleAuthError);
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { token: newToken, user } = response.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setCurrentUser(user);
    setIsAuthenticated(true);
    return user;
  };

  const googleLogin = async (credential, mode = 'login') => {
    const response = await authAPI.googleLogin(credential, mode);
    const { token: newToken, user } = response.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setCurrentUser(user);
    setIsAuthenticated(true);
    return user;
  };

  const register = async (userData) => {
    const response = await authAPI.register(userData);
    const { token: newToken, user } = response.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setCurrentUser(user);
    setIsAuthenticated(true);
    return user;
  };

  const logout = async () => {
    try {
      if (supabase) await supabase.auth.signOut();
    } catch(e) {
      console.error('Supabase signout failed', e);
    }
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    currentUser,
    token,
    isAuthenticated,
    loading,
    login,
    googleLogin,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
