import React, { createContext, useContext, useState, useEffect } from 'react';
import { APP_CONFIG } from '../config';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount and when localStorage changes
  useEffect(() => {
    checkAuthStatus();

    // Listen for storage events (when localStorage changes in other tabs)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    // Listen for auth change events
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem(APP_CONFIG.TOKEN_KEY);
      const userData = localStorage.getItem(APP_CONFIG.USER_KEY);

      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          
          // Validate token with backend
          const response = await axiosInstance.get('/api/v1/auth/validate-token', {
            headers: { Authorization: `Bearer ${token}` },
            isRefresh: true // Mark this request as a refresh
          });

          if (response.data.success !== false) {
            setUser(user);
            setIsAuthenticated(true);
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error('Error validating token:', error);
          // Don't logout on network errors to allow offline functionality
          if (error.response) {
            handleLogout();
          }
        }
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (token, userData) => {
    // Ensure token is stored as string
    const tokenString = typeof token === 'string' ? token : JSON.stringify(token);
    localStorage.setItem(APP_CONFIG.TOKEN_KEY, tokenString);
    localStorage.setItem(APP_CONFIG.USER_KEY, JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
    localStorage.removeItem(APP_CONFIG.USER_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        loading,
        login: handleLogin,
        logout: handleLogout,
        checkAuthStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 