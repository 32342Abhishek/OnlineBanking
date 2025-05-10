import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./Login.css";
import axiosInstance from "../utils/axiosInstance";
import { API_CONFIG, APP_CONFIG } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { logApiResponse, logApiError, extractAuthData, createUserObject } from '../utils/apiUtils';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Check for redirect from registration
  useEffect(() => {
    // Check if there's a registration_success query parameter
    const params = new URLSearchParams(location.search);
    if (params.get('registration_success') === 'true') {
      setSuccessMessage("Registration successful! Please login to continue.");
    }
  }, [location]);
  
  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    // Clear error message when inputs change
    if (error) {
      setError('');
    }
  }, [email, password]);
  
  const handleInitialSubmit = async (event) => {
    event.preventDefault();
    
    // Input validation
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }
    
    // Email format validation
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Password length validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      // TEMPORARY TEST CODE - Direct login without API call for testing
      // This allows bypassing the backend authentication for testing purposes
      if (email === 'test@example.com' && password === 'password123') {
        const mockUser = {
          id: '12345',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'USER',
          phone: '+911234567890',
          isEmailVerified: true,
          isPhoneVerified: true,
          createdAt: new Date().toISOString()
        };
        
        // Create a proper JWT format token
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + 
          btoa(JSON.stringify({
            sub: mockUser.email,
            roles: ['USER'],
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
            iat: Math.floor(Date.now() / 1000)
          })) + '.mockSignature123';
        
        // Save to localStorage for persistence using APP_CONFIG constants
        localStorage.setItem(APP_CONFIG.TOKEN_KEY, mockToken);
        localStorage.setItem(APP_CONFIG.USER_KEY, JSON.stringify(mockUser));
        
        // Use the auth context to update app state
        login(mockToken, mockUser);
        
        // Show success message
        setSuccessMessage("Login successful! Redirecting to home page...");
        
        // Navigate to home page after a short delay
        setTimeout(() => {
          navigate('/home');
        }, 800);
        
        return;
      }
    
      // Regular API login flow for production
      // Prepare login request
      const loginRequest = {
        email,
        password
      };
      
      // Call the backend API to login
      const response = await axiosInstance.post(
        API_CONFIG.AUTH.LOGIN, 
        loginRequest
      );
      
      logApiResponse('Login', response);
      
      // The Spring backend uses ApiResponse wrapper
      if (response.data && response.data.success) {
        const authData = response.data.data;
        
        // Check if MFA is required
        if (authData && authData.mfaRequired) {
          setShowOtpInput(true);
          setSuccessMessage(response.data.message || "OTP has been sent to your registered email/phone.");
        } else {
          // Direct login successful
          handleSuccessfulLogin(authData);
        }
      } else {
        setError(response.data.message || "Failed to login. Please try again.");
      }
    } catch (err) {
      logApiError('Login', err);
      
      if (err.response) {
        if (err.response.status === 403) {
          setError("Access forbidden. Please check your credentials or contact support.");
        } else if (err.response.status === 401) {
          setError("Invalid email or password. Please try again.");
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Login failed. Please check your credentials and try again.");
        }
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Prepare OTP verification request
      const verifyOtpRequest = {
        email,
        otp
      };
      
      // Call the backend API to verify OTP
      const response = await axiosInstance.post(
        API_CONFIG.AUTH.VERIFY_OTP, 
        verifyOtpRequest
      );
      
      logApiResponse('OTP verification', response);
      
      // Handle successful login
      if (response.data && response.data.success) {
        const authData = response.data.data;
        handleSuccessfulLogin(authData);
      } else {
        setError(response.data.message || "Verification failed. Please try again.");
      }
    } catch (err) {
      logApiError('OTP verification', err);
      
      if (err.response) {
        if (err.response.status === 403) {
          setError("Invalid OTP. Please try again or request a new OTP.");
        } else if (err.response.status === 401) {
          setError("Verification failed. Please check your OTP and try again.");
        } else if (err.response.status === 400) {
          setError("Invalid OTP format or expired OTP. Please try again or request a new OTP.");
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Verification failed. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    setError("");
    
    try {
      // In a real implementation, there would be a resend OTP endpoint
      // For now, we'll reuse the login endpoint to trigger another OTP
      const loginRequest = {
        email,
        password
      };
      
      const response = await axiosInstance.post(
        API_CONFIG.AUTH.LOGIN, 
        loginRequest
      );
      
      logApiResponse('Resend OTP', response);
      
      if (response.data && response.data.success) {
        setSuccessMessage(response.data.message || "New OTP has been sent to your registered email/phone.");
      } else {
        setError(response.data.message || "Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      logApiError('Resend OTP', err);
      
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Network error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessfulLogin = async (authData) => {
    if (!authData) {
      setError("Authentication data is invalid. Please try again.");
      return;
    }
    
    try {
      // Extract token and user data from the response
      const { accessToken, user } = authData;
      
      // Store data in localStorage
      localStorage.setItem(APP_CONFIG.TOKEN_KEY, accessToken);
      localStorage.setItem(APP_CONFIG.USER_KEY, JSON.stringify(user));
      
      // Call the login function from auth context
      await login(accessToken, user);
      
      // Get the redirect URL from session storage or location state
      const redirectUrl = sessionStorage.getItem('redirectUrl') || location.state?.from?.pathname || '/home';
      sessionStorage.removeItem('redirectUrl'); // Clear stored URL after use
      
      setSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => navigate(redirectUrl, { replace: true }), 1500);
    } catch (error) {
      console.error('Error in handleSuccessfulLogin:', error);
      setError("Failed to process login. Please try again.");
    }
  };

  // Render OTP verification form
  if (showOtpInput) {
    return (
      <div className="login-container">
        <div className="login-background">
          <div className="login-shape"></div>
          <div className="login-shape"></div>
        </div>
        
        <div className="login-card otp-card">
          <div className="login-header">
            <h1 className="login-title">Verify OTP</h1>
            <p className="login-subtitle">Please enter the 6-digit OTP sent to your email</p>
          </div>
          
          {successMessage && <div className="success-message slide-in">{successMessage}</div>}
          {error && <div className="error-message slide-in">{error}</div>}
          
          <form onSubmit={handleOtpSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="otp">Enter OTP</label>
              <div className="input-with-icon">
                <i className="input-icon">🔒</i>
                <input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength="6"
                />
              </div>
            </div>
            
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? (
                <span className="button-loader"></span>
              ) : (
                "Verify & Login"
              )}
            </button>
            
            <div className="form-footer">
              <button type="button" className="resend-otp" onClick={resendOtp} disabled={loading}>
                Resend OTP
              </button>
              <button 
                type="button" 
                className="back-to-login" 
                onClick={() => setShowOtpInput(false)}
                disabled={loading}
              >
                Back to Login
              </button>
            </div>
          </form>
          
        
        </div>
      </div>
    );
  }

  // Render initial login form
  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-shape"></div>
        <div className="login-shape"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to access your banking dashboard</p>
        </div>
        
        {error && (
          <div className="error-message slide-in">
            <i className="error-icon">⚠️</i> {error}
          </div>
        )}
        
        {successMessage && (
          <div className="success-message slide-in">
            <i className="success-icon">✅</i> {successMessage}
          </div>
        )}
        
        <form id="login-form" className="login-form" onSubmit={handleInitialSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <i className="input-icon">✉️</i>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <i className="input-icon">🔒</i>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" name="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <span className="button-loader"></span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <Link to="/register" className="register-link">Create Account</Link></p>
        </div>
        
       
      </div>
    </div>
  );
};

export default Login;
