import axios from 'axios';
import { API_CONFIG, APP_CONFIG } from '../config';

/**
 * Custom Axios instance configured for the banking API
 */
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * Request interceptor
 * - Adds authorization token from localStorage if available
 * - Handles request configuration
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem(APP_CONFIG.TOKEN_KEY);
    
    // If token exists, add to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Remove demo mode header that causes CORS issues
    // if (process.env.NODE_ENV !== 'production') {
    //   config.headers['X-Demo-Mode'] = 'true';
    // }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * - Handles common response scenarios
 * - Manages authentication errors
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Successful response
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Check if this is not a login/auth endpoint
      const isAuthEndpoint = error.config.url.includes('/auth/');
      
      if (!isAuthEndpoint) {
        console.warn('Authentication error - clearing session');
        
        // Clear token and user data
        localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
        localStorage.removeItem(APP_CONFIG.USER_KEY);
        
        // Dispatch auth change event to update UI
        window.dispatchEvent(new Event('auth-change'));
        
        // Only redirect to login if the request was not a page refresh
        if (!error.config.isRefresh && window.location.pathname !== '/login') {
          window.location.href = '/login?session_expired=true';
        }
      }
    }
    
    // Log all API errors (in development)
    if (process.env.NODE_ENV !== 'production') {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data
      });
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 