/**
 * API Utility Functions
 * This file contains helper functions for API interactions
 */

/**
 * Log API response for debugging
 * @param {string} endpoint - The API endpoint called
 * @param {object} response - The Axios response object
 */
export const logApiResponse = (endpoint, response) => {
  console.log(`API ${endpoint} Response:`, {
    status: response.status,
    data: response.data
  });
};

/**
 * Log API error for debugging
 * @param {string} endpoint - The API endpoint called
 * @param {object} error - The error object
 */
export const logApiError = (endpoint, error) => {
  console.error(`API ${endpoint} Error:`, {
    message: error.message,
    response: error.response ? {
      status: error.response.status,
      data: error.response.data
    } : 'No response',
    config: error.config ? {
      url: error.config.url,
      method: error.config.method
    } : 'No config'
  });
};

/**
 * Extract authentication data from API response
 * This is used for compatibility with the Spring Boot backend
 * 
 * @param {object} response - The API response data
 * @returns {object} - Extracted authentication data
 */
export const extractAuthData = (responseData) => {
  if (!responseData) return null;
  
  // For Spring Boot ApiResponse format
  if (responseData.data) {
    return responseData.data;
  }
  
  // Direct response format
  return responseData;
};

/**
 * Create a user object from authentication response data
 * 
 * @param {object} authData - Authentication data
 * @param {object} additionalData - Additional user data
 * @returns {object} - User object
 */
export const createUserObject = (authData, additionalData = {}) => {
  if (!authData) return null;
  
  // Initialize user with data from additionalData
  const user = { ...additionalData };
  
  // Add data from authData.user if it exists
  if (authData.user) {
    Object.assign(user, authData.user);
  }
  
  return user;
};

/**
 * Format date to ISO string for API requests
 * 
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDateForApi = (date) => {
  if (!date) return null;
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return null;
    
    return dateObj.toISOString();
  } catch (e) {
    console.error('Error formatting date:', e);
    return null;
  }
};

/**
 * Handle API errors and return appropriate error message
 * 
 * @param {object} error - Error object from API call
 * @returns {string} - Error message
 */
export const getApiErrorMessage = (error) => {
  if (error.response) {
    if (error.response.data && error.response.data.message) {
      return error.response.data.message;
    }
    
    // Status-based error messages
    switch (error.response.status) {
      case 400:
        return 'Bad request. Please check your input data.';
      case 401:
        return 'Authentication failed. Please login again.';
      case 403:
        return 'You do not have permission to access this resource.';
      case 404:
        return 'Resource not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return `Error: ${error.response.status} - ${error.response.statusText}`;
    }
  }
  
  // Network error
  if (error.request) {
    return 'Network error. Please check your connection and try again.';
  }
  
  // Default error message
  return error.message || 'An unexpected error occurred. Please try again.';
};

/**
 * Add authorization header to axios config
 * 
 * @param {object} config - Axios request config
 * @param {string} token - JWT token
 * @returns {object} - Updated config with authorization header
 */
export const addAuthHeader = (config, token) => {
  if (!token) return config;
  
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`
    }
  };
};

/**
 * Format API response to match frontend requirements
 * 
 * @param {object} response - Backend API response
 * @param {function} transformer - Optional transformer function
 * @returns {object} - Formatted response
 */
export const formatApiResponse = (response, transformer = null) => {
  // If response is not using the ApiResponse wrapper
  if (!response.success && !response.message && !response.data && !response.timestamp) {
    return response;
  }
  
  const result = {
    success: response.success,
    message: response.message,
    data: transformer ? transformer(response.data) : response.data,
    timestamp: response.timestamp
  };
  
  return result;
};

export default {
  logApiResponse,
  logApiError,
  extractAuthData,
  createUserObject,
  formatDateForApi,
  getApiErrorMessage,
  addAuthHeader,
  formatApiResponse
}; 