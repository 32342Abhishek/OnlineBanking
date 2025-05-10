import axios from 'axios';
import { API_CONFIG } from '../config';

/**
 * Utility to test connection with backend API
 * Uses the health endpoint to verify connectivity
 */
export const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await axios.get(`${API_CONFIG.BASE_URL}/api/v1/health`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('Backend connection test result:', response.data);
    
    return {
      connected: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Backend connection test failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    return {
      connected: false,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Checks if backend API authentication is working
 * @param {string} token Optional JWT token to test with
 */
export const testAuthConnection = async (token) => {
  try {
    console.log('Testing authentication connection...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axios.get(`${API_CONFIG.BASE_URL}/api/v1/auth/health`, {
      signal: controller.signal,
      headers
    });
    
    clearTimeout(timeoutId);
    
    console.log('Auth connection test result:', response.data);
    
    return {
      connected: true,
      authenticated: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Auth connection test failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Determine if this is an auth error or connectivity error
    const isAuthError = error.response?.status === 401 || error.response?.status === 403;
    
    return {
      connected: error.response?.status ? true : false,
      authenticated: false,
      authError: isAuthError,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

export default { testBackendConnection, testAuthConnection }; 