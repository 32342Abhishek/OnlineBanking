import axios from 'axios';
import { API_CONFIG, APP_CONFIG } from '../config';

// Enable debug mode for detailed logging
const DEBUG = true;

// Debug helper function
const debug = (message, data) => {
  if (DEBUG) {
    console.log(`[AxiosInstance Debug] ${message}`, data !== undefined ? data : '');
  }
};

// Utility function to normalize API paths and prevent duplication
const normalizeApiPath = (path) => {
  // If path is not a string, return as is
  if (typeof path !== 'string') {
    debug('Path is not a string:', path);
    return path;
  }
  
  // With our new configuration, we don't need to modify paths
  // as we've fixed the configuration to avoid duplication
  
  // Special case: if path doesn't start with /, add it
  if (!path.startsWith('/')) {
    debug('Adding leading slash to path:', { original: path, normalized: '/' + path });
    return '/' + path;
  }
  
  return path;
};

// List of endpoints that don't require authentication
const publicEndpoints = [
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/verify-otp',
  '/api/v1/health'
];

// Log configuration for debugging
debug('Public endpoints:', publicEndpoints);
debug('BASE URL configured as:', API_CONFIG.BASE_URL);

// Check for missing API_BASE_URL
if (!API_CONFIG.BASE_URL) {
  console.error('Missing API_BASE_URL configuration! This will cause API requests to fail.');
}

// Function to get CSRF token from cookies if available
const getCsrfToken = () => {
  const match = document.cookie.match('(^|;)\\s*XSRF-TOKEN\\s*=\\s*([^;]+)');
  return match ? match[2] : '';
};

// Create axios instance with base URL
debug('Creating axios instance with base URL:', API_CONFIG.BASE_URL);
const API_BASE_URL = API_CONFIG.BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,  // Remove /api/v1 from here since it's in the endpoints
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000,
  withCredentials: true
});

// Add logging interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    // Log full request details
    debug('Full request details:', {
      url: config.baseURL + config.url,
      method: config.method?.toUpperCase(),
      headers: config.headers,
      data: config.data
    });

    // Normalize the URL path
    if (config.url) {
      config.url = normalizeApiPath(config.url);
    }
    
    // Check if this is a public endpoint (no token needed)
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url.includes(endpoint)
    );
    
    // Add token for protected endpoints
    if (!isPublicEndpoint) {
      const token = localStorage.getItem(APP_CONFIG.TOKEN_KEY);
      if (token) {
        try {
          // Parse the token if it's stored as JSON
          let tokenValue = token;
          if (token.startsWith('{')) {
            const tokenObj = JSON.parse(token);
            tokenValue = tokenObj.token || token;
          }
          
          // Log token details for debugging
          debug('Token being used:', {
            token: tokenValue.substring(0, 20) + '...',
            length: tokenValue.length,
            isJWT: tokenValue.split('.').length === 3
          });

          config.headers['Authorization'] = `Bearer ${tokenValue}`;
        } catch (error) {
          console.error('Error parsing token:', error);
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      } else {
        debug('No auth token available for protected endpoint');
      }
    }
    
    return config;
  },
  (error) => {
    console.error('Request preparation error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => {
    debug('Response received:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      headers: response.headers,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Enhanced error logging
    const errorDetails = {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers,
      requestData: error.config?.data,
      responseData: error.response?.data
    };

    console.error('API Error Details:', errorDetails);

    if (error.response?.status === 403) {
      // Check token validity
      const token = localStorage.getItem(APP_CONFIG.TOKEN_KEY);
      if (token) {
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            debug('Token payload:', {
              exp: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'Not found',
              roles: payload.roles || [],
              sub: payload.sub || 'Not found'
            });
          }
        } catch (e) {
          debug('Error parsing token payload:', e);
        }
      }
    }

    return Promise.reject(error);
  }
);

// Add a method to test a connection to the backend
axiosInstance.testConnection = async () => {
  try {
    debug('Testing connection to backend server');
    const response = await axiosInstance.get('/health', {
      timeout: 5000 // Short timeout for testing
    });
    
    return {
      success: true,
      status: response.status,
      message: 'Successfully connected to backend server',
      data: response.data
    };
  } catch (error) {
    debug('Connection test failed', error);
    
    return {
      success: false,
      error: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

export default axiosInstance; 