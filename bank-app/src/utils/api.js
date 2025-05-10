import { authenticateRequest, logout } from './auth';

// Base API URL
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Generic function to make authenticated API requests
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise<Object>} - Response data or error
 */
export const apiRequest = async (endpoint, options = {}) => {
  return authenticateRequest(async (token) => {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      // Setup default headers
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': token,
        ...options.headers
      };
      
      const response = await fetch(url, {
        ...options,
        headers
      });
      
      // Handle different response statuses
      if (response.status === 401 || response.status === 403) {
        // Authentication error - need to log out
        console.error('Authentication error:', response.status);
        logout();
        return { success: false, authError: true };
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error:', response.status, errorData);
        return { 
          success: false, 
          status: response.status, 
          message: errorData.message || 'An error occurred'
        };
      }
      
      // For successful responses, try to parse JSON or return empty object
      const data = await response.json().catch(() => ({}));
      return { success: true, data };
    } catch (error) {
      console.error('API request error:', error);
      return { success: false, error: error.message };
    }
  });
};

/**
 * Common API functions for the banking application
 */

// Get user profile data
export const getUserProfile = () => {
  return apiRequest('/user/profile', { method: 'GET' });
};

// Get user accounts
export const getUserAccounts = () => {
  return apiRequest('/accounts', { method: 'GET' });
};

// Get user transactions
export const getUserTransactions = (accountId, limit = 10) => {
  return apiRequest(`/accounts/${accountId}/transactions?limit=${limit}`, { method: 'GET' });
};

// Transfer money
export const transferMoney = (fromAccount, toAccount, amount, description) => {
  return apiRequest('/transfers', {
    method: 'POST',
    body: JSON.stringify({
      fromAccount,
      toAccount,
      amount,
      description
    })
  });
};

// Pay bill
export const payBill = (accountId, billerCode, amount, reference) => {
  return apiRequest('/payments/bills', {
    method: 'POST',
    body: JSON.stringify({
      accountId,
      billerCode,
      amount,
      reference
    })
  });
}; 