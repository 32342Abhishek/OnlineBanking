import axiosInstance from './axiosInstance';
import axios from 'axios';
import { API_CONFIG, APP_CONFIG } from '../config';

// Helper function to format dates correctly for backend
const formatDateForBackend = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null; // Invalid date
    }
    
    // Format for Java LocalDateTime
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return null;
  }
};

// Helper to extract data from ApiResponse structure
const extractApiResponseData = (response) => {
  if (!response || !response.data) {
    return null;
  }
  
  // Handle ApiResponse structure: { success, message, data }
  if (response.data.hasOwnProperty('success') && response.data.hasOwnProperty('data')) {
    return response.data.data;
  }
  
  return response.data;
};

const authService = {
  // Expose axios instance for debugging
  axiosInstance,
  
  // Helper for date formatting
  formatDateForBackend,

  // Check if user is authenticated
  checkAuth: () => {
    console.log('Checking authentication status');
    
    const token = localStorage.getItem(APP_CONFIG.TOKEN_KEY);
    if (!token) {
      console.error('Authentication required but no token found');
      throw new Error('Authentication required. Please log in first.');
    }
    
    // Parse token if it's stored as JSON
    let tokenValue = token;
    try {
      if (token.startsWith('{')) {
        const tokenObj = JSON.parse(token);
        tokenValue = tokenObj.token || token;
      }
    } catch (error) {
      console.error('Error parsing token:', error);
      // Use token as is if parsing fails
    }
    
    // Check token expiry from localStorage
    const tokenExpiry = localStorage.getItem(APP_CONFIG.TOKEN_KEY + '_expiry');
    if (tokenExpiry && parseInt(tokenExpiry) < new Date().getTime()) {
      console.error('Token has expired');
      localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
      localStorage.removeItem(APP_CONFIG.USER_KEY);
      localStorage.removeItem(APP_CONFIG.TOKEN_KEY + '_expiry');
      throw new Error('Your session has expired. Please log in again.');
    }
    
    return true;
  },

  // Check if server is running
  checkServerConnection: async () => {
    try {
      // Try a simple ping to the server
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
        method: 'GET',
        signal: controller.signal,
        mode: 'cors' // explicitly request CORS
      });
      
      clearTimeout(timeoutId);
      return { online: true, status: response.status };
    } catch (error) {
      console.error('Server connection check failed:', error);
      
      // Check if this is a CORS error
      if (error.message.includes('CORS') || 
          error.message.includes('cross-origin') ||
          error.message instanceof TypeError) {
        // This could be a CORS error or server not running
        return { 
          online: false, 
          error: 'Cannot connect due to CORS policy or server not running. Ensure the Spring Boot backend is running on port 8080 and has proper CORS configuration.' 
        };
      }
      
      // Check if this is a network error (server not running)
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('NetworkError') ||
          error.message.includes('Network Error')) {
        return { 
          online: false, 
          error: 'Backend server is not running. Please start the Spring Boot application on port 8080.' 
        };
      }
      
      return { online: false, error: error.message };
    }
  },

  // Register a new user
  register: async (registerData) => {
    try {
      console.log('Attempting to register with:', registerData);
      
      // Check server connection first
      const serverStatus = await authService.checkServerConnection();
      if (!serverStatus.online) {
        throw new Error('Server is not reachable. Please check if the backend server is running.');
      }
      
      const response = await axiosInstance.post(API_CONFIG.AUTH.REGISTER, registerData);
      console.log('Registration response:', response.data);
      
      // Extract data from ApiResponse structure
      const responseData = extractApiResponseData(response);
      
      // Check if registration was successful
      if (responseData) {
        console.log('Registration successful:', responseData);
        
        // Store token if available (may not be in case of OTP verification)
        if (responseData.token) {
          localStorage.setItem(APP_CONFIG.TOKEN_KEY, responseData.token);
        }
        
        return responseData;
      } else {
        throw new Error('Unexpected response format from server during registration.');
      }
    } catch (error) {
      console.error('Registration error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      console.log('Attempting login with:', { email: credentials.email });
      
      const response = await axiosInstance.post(API_CONFIG.AUTH.LOGIN, credentials);
      console.log('Login successful, response:', response.data);
      
      // Extract token and user data
      const responseData = response.data.data || response.data;
      const token = responseData.token || responseData;
      const user = responseData.user || responseData;
      
      if (!token) {
        console.error('No token received in login response');
        throw new Error('Authentication failed. No token received.');
      }
      
      // Store token as string
      localStorage.setItem(APP_CONFIG.TOKEN_KEY, typeof token === 'string' ? token : JSON.stringify({ token }));
      localStorage.setItem(APP_CONFIG.USER_KEY, typeof user === 'object' ? JSON.stringify(user) : user);
      
      // Set token expiry
      const expiryTime = new Date().getTime() + (APP_CONFIG.TOKEN_EXPIRY * 1000);
      localStorage.setItem(APP_CONFIG.TOKEN_KEY + '_expiry', expiryTime.toString());
      
      console.log('Authentication data stored successfully');
      return { user, token };
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      throw new Error(error.response?.data?.message || error.message || 'Login failed. Please check your credentials and try again.');
    }
  },

  // Verify OTP for 2FA
  verifyOtp: async (verifyData) => {
    try {
      const response = await axiosInstance.post(API_CONFIG.AUTH.VERIFY_OTP, verifyData);
      console.log('OTP verification response:', response.data);
      
      // Extract data from ApiResponse structure
      const responseData = extractApiResponseData(response);
      
      if (!responseData) {
        throw new Error('Invalid response format from server during OTP verification.');
      }
      
      // Extract token and user data
      const token = responseData.token;
      const userData = responseData.user || responseData;
      
      // Store token and user data
      if (token) {
        localStorage.setItem(APP_CONFIG.TOKEN_KEY, token);
      }
      
      if (userData) {
        localStorage.setItem(APP_CONFIG.USER_KEY, JSON.stringify(userData));
      }
      
      return {
        user: userData,
        token
      };
    } catch (error) {
      console.error('OTP verification error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
    localStorage.removeItem(APP_CONFIG.USER_KEY);
    return true;
  },

  // Get current user info
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem(APP_CONFIG.USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem(APP_CONFIG.TOKEN_KEY);
  },
  
  // Test backend connectivity
  testConnection: async () => {
    try {
      // Try accessing a simple endpoint
      const response = await axiosInstance.get('/health');
      console.log('Backend connection test successful:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Backend connection test failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      return { 
        success: false, 
        error: error.message,
        details: {
          status: error.response?.status,
          data: error.response?.data
        }
      };
    }
  },

  // Explicitly validate token with backend
  validateToken: async () => {
    try {
      const token = localStorage.getItem(APP_CONFIG.TOKEN_KEY);
      if (!token) {
        console.error('No token to validate');
        return { valid: false, reason: 'No token found' };
      }
      
      console.log('Validating token with backend');
      
      // Normalize the endpoint path
      let validateEndpoint = '/auth/validate-token';
      if (API_CONFIG.BASE_URL.includes('/api/v1') && validateEndpoint.startsWith('/api/v1')) {
        validateEndpoint = validateEndpoint.substring(7);
      }
      
      // Add token to headers
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      const response = await axiosInstance.get(validateEndpoint, { headers });
      console.log('Token validation response:', response.data);
      
      return { 
        valid: true, 
        user: response.data.data || response.data,
        message: 'Token is valid'
      };
    } catch (error) {
      console.error('Token validation failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Handle specific error cases
      if (error.response) {
        if (error.response.status === 401) {
          // Clear invalid token
          localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
          localStorage.removeItem(APP_CONFIG.USER_KEY);
          return { valid: false, reason: 'Token is invalid or expired' };
        } else if (error.response.status === 403) {
          return { valid: false, reason: 'Insufficient permissions' };
        }
      }
      
      return { 
        valid: false, 
        reason: error.message || 'Token validation failed',
        error: error
      };
    }
  },

  // Force refresh token
  refreshToken: async () => {
    try {
      const token = localStorage.getItem(APP_CONFIG.TOKEN_KEY);
      if (!token) {
        console.error('No token to refresh');
        return { success: false, reason: 'No token found' };
      }
      
      console.log('Attempting to refresh token');
      
      // Normalize the endpoint path
      let refreshEndpoint = '/auth/refresh-token';
      if (API_CONFIG.BASE_URL.includes('/api/v1') && refreshEndpoint.startsWith('/api/v1')) {
        refreshEndpoint = refreshEndpoint.substring(7);
      }
      
      // Add token to headers
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      const response = await axiosInstance.post(refreshEndpoint, {}, { headers });
      console.log('Token refresh response:', response.data);
      
      // Extract new token
      const newToken = response.data.data?.token || response.data.token;
      
      if (newToken) {
        // Store new token
        localStorage.setItem(APP_CONFIG.TOKEN_KEY, newToken);
        
        // Set new expiry time
        const expiryTime = new Date().getTime() + (APP_CONFIG.TOKEN_EXPIRY * 1000);
        localStorage.setItem(APP_CONFIG.TOKEN_KEY + '_expiry', expiryTime.toString());
        
        console.log('Token refreshed successfully');
        return { success: true, message: 'Token refreshed successfully' };
      } else {
        console.error('No new token received in refresh response');
        return { success: false, reason: 'No new token received' };
      }
    } catch (error) {
      console.error('Token refresh failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Handle specific error cases
      if (error.response && error.response.status === 401) {
        // Clear invalid token
        localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
        localStorage.removeItem(APP_CONFIG.USER_KEY);
      }
      
      return { 
        success: false, 
        reason: error.message || 'Token refresh failed',
        error: error
      };
    }
  }
};

export default authService; 