import axiosInstance from './axiosInstance';
import { authService } from '.';
import { API_CONFIG } from '../config';

// Enable debug mode for more detailed logging
const DEBUG = true;

// Helper to log debug information
const debug = (message, data) => {
  if (DEBUG) {
    console.log(`[AccountService Debug] ${message}`, data !== undefined ? data : '');
  }
};

// Utility function to normalize API paths and prevent duplication
const normalizeApiPath = (path) => {
  const baseUrl = API_CONFIG.BASE_URL || '';
  
  // If baseUrl already contains /api/v1 and path also starts with /api/v1, remove it from path
  if (baseUrl.includes('/api/v1') && path.startsWith('/api/v1')) {
    console.log('Normalizing path to avoid duplication:', { original: path, normalized: path.substring(7) });
    return path.substring(7); // Remove /api/v1 prefix
  }
  
  return path;
};

const accountService = {
  // Create a new account
  createAccount: async (accountData) => {
    try {
      // Check authentication first
      debug('Checking authentication');
      const isAuthenticated = authService.checkAuth();
      debug('Authentication check result:', isAuthenticated);
      
      // Get and validate token
      const token = authService.getToken();
      if (!token) {
        debug('No authentication token found');
        throw new Error('Authentication required. Please log in first.');
      }
      
      debug('Creating account with data:', accountData);
      
      // Validate required fields for account creation
      if (!accountData.accountType) {
        debug('Missing required field: accountType');
        throw new Error('Account type is required.');
      }
      
      // Normalize the API path to prevent duplication
      const endpoint = normalizeApiPath(API_CONFIG.ACCOUNTS.CREATE);
      
      // Debug logging for API path construction
      const fullEndpoint = API_CONFIG.BASE_URL + endpoint;
      debug('Full API endpoint URL:', fullEndpoint);
      debug('Base URL:', API_CONFIG.BASE_URL);
      debug('Normalized endpoint path:', endpoint);
      
      // Add specific headers for this request
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      debug('Request headers:', headers);
      
      // Try a test connection first to check auth
      try {
        debug('Testing authentication with a simple request');
        const testEndpoint = normalizeApiPath('/health');
        await axiosInstance.get(testEndpoint, { headers });
        debug('Authentication test successful');
      } catch (testError) {
        debug('Authentication test failed:', testError.message);
        // Continue anyway, just for diagnostics
      }
      
      // Make the API call with explicit headers
      debug('Sending account creation request');
      const response = await axiosInstance.post(endpoint, accountData, { headers });
      debug('Raw API response:', response);
      
      if (!response.data) {
        debug('Empty response data');
        throw new Error('Received empty response from server.');
      }
      
      debug('Account created successfully:', response.data);
      
      // Handle different response formats
      if (response.data.data) {
        return response.data.data;
      } else {
        return response.data;
      }
    } catch (error) {
      // Enhanced error logging
      console.error('Error creating account:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        code: error.code,
        stack: DEBUG ? error.stack : null
      });
      
      // Connection errors
      if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        debug('Connection error detected', error.code);
        throw new Error('Could not connect to the server. Please check your internet connection and try again.');
      }
      
      // CORS errors typically have no response
      if (error.message.includes('Network Error') && !error.response) {
        debug('Potential CORS error detected');
        throw new Error('Network error - this might be due to CORS configuration issues. Please contact support.');
      }
      
      // Handle specific HTTP error codes
      if (error.response) {
        const { status } = error.response;
        debug(`HTTP ${status} error received`, error.response.data);
        
        switch (status) {
          case 400:
            throw new Error(error.response.data?.message || 'Invalid account data provided. Please check your inputs.');
          case 401:
            // Clear token and redirect to login
            localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
            localStorage.removeItem(APP_CONFIG.USER_KEY);
            throw new Error('Your session has expired. Please log in again.');
          case 403:
            debug('Permission denied - checking token validity');
            // Check if token is valid but user doesn't have permission
            if (authService.getToken()) {
              throw new Error('You do not have permission to create an account. Please check with your administrator.');
            } else {
              throw new Error('Authentication required. Please log in first.');
            }
          case 404:
            throw new Error('Account creation endpoint not found. Please contact support.');
          case 409:
            throw new Error(error.response.data?.message || 'Account with these details already exists.');
          case 500:
            throw new Error('Server error occurred. Please try again later or contact support.');
          default:
            throw new Error(error.response.data?.message || error.message || 'Failed to create account. Please try again.');
        }
      }
      
      // Generic error fallback
      throw new Error(error.message || 'Failed to create account. Please try again.');
    }
  },

  // Create a specific type of account
  createSpecificAccount: async (accountType, accountData) => {
    try {
      // Check authentication first
      debug('Checking authentication for specific account creation');
      authService.checkAuth();
      
      debug(`Determining endpoint for account type: ${accountType}`);
      let endpoint;
      switch(accountType.toLowerCase()) {
        case 'savings':
          endpoint = API_CONFIG.ACCOUNTS.CREATE_SAVINGS;
          break;
        case 'current':
          endpoint = API_CONFIG.ACCOUNTS.CREATE_CURRENT;
          break;
        case 'zero-balance':
          endpoint = API_CONFIG.ACCOUNTS.CREATE_ZERO_BALANCE;
          break;
        case 'joint':
          endpoint = API_CONFIG.ACCOUNTS.CREATE_JOINT;
          break;
        case 'digital':
          endpoint = API_CONFIG.ACCOUNTS.CREATE_DIGITAL;
          break;
        case 'senior-citizen':
          endpoint = API_CONFIG.ACCOUNTS.CREATE_SENIOR_CITIZEN;
          break;
        case 'salary':
          endpoint = API_CONFIG.ACCOUNTS.CREATE_SALARY;
          break;
        default:
          debug(`Unknown account type: ${accountType}, falling back to default endpoint`);
          endpoint = API_CONFIG.ACCOUNTS.CREATE;
      }
      
      // Normalize the endpoint to prevent path duplication
      endpoint = normalizeApiPath(endpoint);
      debug(`Creating ${accountType} account with normalized endpoint ${endpoint}`, accountData);
      
      // For debugging purposes, make a test connection first
      try {
        const healthEndpoint = normalizeApiPath('/health');
        const testResponse = await axiosInstance.get(healthEndpoint);
        debug('Server health check succeeded', testResponse.data);
      } catch (healthError) {
        debug('Server health check failed', healthError);
        // Continue anyway, just for diagnostics
      }
      
      const response = await axiosInstance.post(endpoint, accountData);
      debug('Account created successfully:', response.data);
      
      // Handle different response formats
      if (response.data.data) {
        return response.data.data;
      } else {
        return response.data;
      }
    } catch (error) {
      console.error(`Error creating ${accountType} account:`, {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        code: error.code
      });
      
      // Connection errors
      if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new Error('Could not connect to the server. Please check your internet connection and try again.');
      }
      
      // Handle specific HTTP error codes
      if (error.response) {
        const { status } = error.response;
        
        switch (status) {
          case 400:
            throw new Error(error.response.data?.message || 'Invalid account data provided. Please check your inputs.');
          case 401:
            throw new Error('Your session has expired. Please log in again.');
          case 403:
            throw new Error('You do not have permission to create an account.');
          case 404:
            throw new Error('Account creation endpoint not found. Please contact support.');
          case 409:
            throw new Error(error.response.data?.message || 'Account with these details already exists.');
          case 500:
            throw new Error('Server error occurred. Please try again later or contact support.');
          default:
            throw new Error(error.response.data?.message || error.message || `Failed to create ${accountType} account. Please try again.`);
        }
      }
      
      throw new Error(error.message || `Failed to create ${accountType} account. Please try again.`);
    }
  },

  // Test account creation endpoint
  testAccountEndpoint: async () => {
    try {
      debug('Testing account creation endpoint');
      const token = authService.getToken();
      
      // First check if authenticated
      if (!token) {
        return { success: false, error: 'Not authenticated. Please log in first.' };
      }
      
      // Normalize endpoints
      const createEndpoint = normalizeApiPath(API_CONFIG.ACCOUNTS.CREATE);
      const getAllEndpoint = normalizeApiPath(API_CONFIG.ACCOUNTS.GET_ALL);
      
      // Try to call OPTIONS on the account endpoint to test CORS
      try {
        const optionsResponse = await fetch(API_CONFIG.BASE_URL + createEndpoint, {
          method: 'OPTIONS',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        debug('OPTIONS request result', {
          status: optionsResponse.status,
          ok: optionsResponse.ok,
          headers: Object.fromEntries([...optionsResponse.headers.entries()])
        });
      } catch (optionsError) {
        debug('OPTIONS request failed', optionsError);
      }
      
      // Try a GET request first (which should at least give a 405 if endpoint exists)
      const response = await axiosInstance.get(getAllEndpoint);
      
      return {
        success: true,
        endpoint: createEndpoint,
        message: 'Account endpoint is available and responding',
        data: response.data
      };
    } catch (error) {
      debug('Account endpoint test failed', error);
      
      return {
        success: false,
        endpoint: API_CONFIG.ACCOUNTS.CREATE,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }
  },

  // Get all accounts for current user
  getAllAccounts: async () => {
    try {
      authService.checkAuth();
      console.log('Fetching all accounts');
      
      // Normalize the endpoint path to prevent duplication
      const endpoint = normalizeApiPath(API_CONFIG.ACCOUNTS.GET_ALL);
      console.log('Using normalized endpoint:', endpoint);
      console.log('Full URL:', API_CONFIG.BASE_URL + endpoint);
      
      const response = await axiosInstance.get(endpoint);
      console.log('Accounts fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching accounts:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch accounts. Please try again.');
    }
  },

  // Get accounts by type
  getAccountsByType: async (accountType) => {
    try {
      // Check authentication first
      authService.checkAuth();
      
      console.log(`Fetching accounts of type: ${accountType}`);
      let url = API_CONFIG.ACCOUNTS.GET_BY_TYPE.replace('{type}', accountType);
      url = normalizeApiPath(url);
      console.log('Using normalized endpoint:', url);
      
      const response = await axiosInstance.get(url);
      console.log('Accounts fetched successfully:', response.data);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching ${accountType} accounts:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      throw new Error(error.response?.data?.message || error.message || `Failed to fetch ${accountType} accounts. Please try again.`);
    }
  },

  // Get account by ID
  getAccountById: async (accountId) => {
    try {
      // Check authentication first
      authService.checkAuth();
      
      console.log(`Fetching account with ID: ${accountId}`);
      let url = API_CONFIG.ACCOUNTS.GET_DETAILS.replace('{id}', accountId);
      url = normalizeApiPath(url);
      console.log('Using normalized endpoint:', url);
      
      const response = await axiosInstance.get(url);
      console.log('Account fetched successfully:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching account by ID:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.response?.status === 404) {
        throw new Error('Account not found. It may have been deleted or does not exist.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to access this account.');
      } else if (error.response?.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch account. Please try again.');
      }
    }
  },

  // Get account by account number
  getAccountByNumber: async (accountNumber) => {
    try {
      // Check authentication first
      authService.checkAuth();
      
      console.log(`Fetching account with number: ${accountNumber}`);
      let url = API_CONFIG.ACCOUNTS.GET_BY_NUMBER.replace('{accountNumber}', accountNumber);
      url = normalizeApiPath(url);
      console.log('Using normalized endpoint:', url);
      
      const response = await axiosInstance.get(url);
      console.log('Account fetched successfully:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching account by number:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.response?.status === 404) {
        throw new Error('Account not found with the provided account number.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to access this account.');
      } else if (error.response?.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch account. Please try again.');
      }
    }
  },

  // Update account details
  updateAccount: async (accountId, accountData) => {
    try {
      // Check authentication first
      authService.checkAuth();
      
      console.log(`Updating account with ID: ${accountId}`, accountData);
      let url = API_CONFIG.ACCOUNTS.UPDATE.replace('{id}', accountId);
      url = normalizeApiPath(url);
      console.log('Using normalized endpoint:', url);
      
      const response = await axiosInstance.put(url, accountData);
      console.log('Account updated successfully:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating account:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.response?.status === 404) {
        throw new Error('Account not found. It may have been deleted or does not exist.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to update this account.');
      } else if (error.response?.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to update account. Please try again.');
      }
    }
  },

  // Close/delete account
  closeAccount: async (accountId) => {
    try {
      // Check authentication first
      authService.checkAuth();
      
      console.log(`Closing account with ID: ${accountId}`);
      let url = API_CONFIG.ACCOUNTS.CLOSE.replace('{id}', accountId);
      url = normalizeApiPath(url);
      console.log('Using normalized endpoint:', url);
      
      const response = await axiosInstance.delete(url);
      console.log('Account closed successfully:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error closing account:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.response?.status === 404) {
        throw new Error('Account not found. It may have been deleted or does not exist.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to close this account.');
      } else if (error.response?.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to close account. Please try again.');
      }
    }
  }
};

export default accountService; 