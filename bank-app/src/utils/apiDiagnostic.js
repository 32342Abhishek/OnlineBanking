import axiosInstance from '../api/axiosInstance';
import { API_CONFIG, APP_CONFIG } from '../config';

/**
 * Utility for diagnosing API connection issues
 */
const apiDiagnostic = {
  /**
   * Test the connection to the investment API endpoints
   */
  testInvestmentEndpoints: async () => {
    const results = {
      baseUrl: API_CONFIG.BASE_URL,
      endpoints: {},
      success: false,
      errors: [],
      auth: {
        hasToken: false,
        tokenValue: null,
        tokenExpiry: null,
        hasUser: false
      }
    };
    
    try {
      // Check authentication status
      const token = localStorage.getItem(APP_CONFIG.TOKEN_KEY);
      const tokenExpiry = localStorage.getItem(APP_CONFIG.TOKEN_KEY + '_expiry');
      const user = localStorage.getItem(APP_CONFIG.USER_KEY);
      
      results.auth.hasToken = !!token;
      results.auth.tokenExpiry = tokenExpiry ? new Date(parseInt(tokenExpiry)) : null;
      results.auth.hasUser = !!user;
      results.auth.isExpired = tokenExpiry ? (new Date().getTime() > parseInt(tokenExpiry)) : true;
      
      if (token) {
        // Only show first few characters for security
        results.auth.tokenValue = token.substring(0, 10) + '...';
      }
      
      // Test fixed deposit endpoint
      const fdEndpoint = API_CONFIG.INVESTMENTS.FIXED_DEPOSIT;
      results.endpoints.fixedDeposit = {
        endpoint: fdEndpoint,
        fullUrl: API_CONFIG.BASE_URL + fdEndpoint,
        normalizedEndpoint: fdEndpoint.startsWith('/api/v1') && API_CONFIG.BASE_URL.includes('/api/v1') ? 
          fdEndpoint.substring(7) : fdEndpoint
      };
      
      console.log('Testing fixed deposit endpoint:', results.endpoints.fixedDeposit.fullUrl);
      
      try {
        // Test with a GET request first (should return all deposits or 401 if auth required)
        const fdResponse = await axiosInstance.get(results.endpoints.fixedDeposit.normalizedEndpoint);
        results.endpoints.fixedDeposit.getStatus = fdResponse.status;
        results.endpoints.fixedDeposit.getSuccess = true;
      } catch (err) {
        results.endpoints.fixedDeposit.getStatus = err.response?.status;
        results.endpoints.fixedDeposit.getSuccess = false;
        results.endpoints.fixedDeposit.getError = err.message;
        results.errors.push(`Fixed deposit GET error: ${err.message}`);
      }
      
      // Test health endpoint if available
      try {
        const healthEndpoint = '/health';
        const normalizedHealthEndpoint = healthEndpoint.startsWith('/api/v1') && API_CONFIG.BASE_URL.includes('/api/v1') ? 
          healthEndpoint.substring(7) : healthEndpoint;
          
        const healthResponse = await axiosInstance.get(normalizedHealthEndpoint);
        results.health = {
          status: healthResponse.status,
          success: true,
          data: healthResponse.data
        };
      } catch (err) {
        results.health = {
          status: err.response?.status,
          success: false,
          error: err.message
        };
        results.errors.push(`Health endpoint error: ${err.message}`);
      }
      
      // Check for common issues
      if (!results.auth.hasToken) {
        results.errors.push('Authentication token missing. Please log in again.');
      } else if (results.auth.isExpired) {
        results.errors.push('Authentication token expired. Please log in again.');
      }
      
      if (results.endpoints.fixedDeposit.getStatus === 403) {
        results.errors.push('Permission denied (403). This could be due to incorrect API paths or missing/invalid authentication.');
      }
      
      // Overall success if we got at least one successful response
      results.success = results.endpoints.fixedDeposit.getSuccess || 
                        (results.health && results.health.success);
      
    } catch (err) {
      results.errors.push(`General diagnostic error: ${err.message}`);
    }
    
    console.log('API diagnostic results:', results);
    return results;
  },

  /**
   * Test the connection to account API endpoints
   */
  testAccountEndpoints: async () => {
    const results = {
      baseUrl: API_CONFIG.BASE_URL,
      endpoints: {},
      success: false,
      errors: [],
      auth: {
        hasToken: false,
        tokenValue: null,
        tokenExpiry: null,
        hasUser: false
      }
    };
    
    try {
      // Check authentication status
      const token = localStorage.getItem(APP_CONFIG.TOKEN_KEY);
      const tokenExpiry = localStorage.getItem(APP_CONFIG.TOKEN_KEY + '_expiry');
      const user = localStorage.getItem(APP_CONFIG.USER_KEY);
      
      results.auth.hasToken = !!token;
      results.auth.tokenExpiry = tokenExpiry ? new Date(parseInt(tokenExpiry)) : null;
      results.auth.hasUser = !!user;
      results.auth.isExpired = tokenExpiry ? (new Date().getTime() > parseInt(tokenExpiry)) : true;
      
      if (token) {
        // Only show first few characters for security
        results.auth.tokenValue = token.substring(0, 10) + '...';
      }
      
      // Test accounts endpoint
      const accountsEndpoint = API_CONFIG.ACCOUNTS.GET_ALL;
      results.endpoints.accounts = {
        endpoint: accountsEndpoint,
        fullUrl: API_CONFIG.BASE_URL + accountsEndpoint,
        normalizedEndpoint: accountsEndpoint.startsWith('/api/v1') && API_CONFIG.BASE_URL.includes('/api/v1') ? 
          accountsEndpoint.substring(7) : accountsEndpoint
      };
      
      console.log('Testing accounts endpoint:', results.endpoints.accounts.fullUrl);
      
      try {
        // Test with a GET request
        const accountsResponse = await axiosInstance.get(results.endpoints.accounts.normalizedEndpoint);
        results.endpoints.accounts.getStatus = accountsResponse.status;
        results.endpoints.accounts.getSuccess = true;
      } catch (err) {
        results.endpoints.accounts.getStatus = err.response?.status;
        results.endpoints.accounts.getSuccess = false;
        results.endpoints.accounts.getError = err.message;
        results.errors.push(`Accounts GET error: ${err.message}`);
      }
      
      // Check for common issues
      if (!results.auth.hasToken) {
        results.errors.push('Authentication token missing. Please log in again.');
      } else if (results.auth.isExpired) {
        results.errors.push('Authentication token expired. Please log in again.');
      }
      
      if (results.endpoints.accounts.getStatus === 403) {
        results.errors.push('Permission denied (403) for accounts. This could be due to incorrect API paths or missing/invalid authentication.');
      }
      
      // Overall success if we got at least one successful response
      results.success = results.endpoints.accounts.getSuccess;
      
    } catch (err) {
      results.errors.push(`General diagnostic error: ${err.message}`);
    }
    
    console.log('Account API diagnostic results:', results);
    return results;
  },

  /**
   * Test all API endpoints
   */
  testAllEndpoints: async () => {
    const results = {
      investments: await apiDiagnostic.testInvestmentEndpoints(),
      accounts: await apiDiagnostic.testAccountEndpoints(),
      success: false,
      baseUrl: API_CONFIG.BASE_URL,
      errors: []
    };
    
    // Combine results
    results.success = results.investments.success || results.accounts.success;
    
    // Check for path duplication issues
    if (API_CONFIG.BASE_URL.includes('/api/v1')) {
      const investmentEndpoint = API_CONFIG.INVESTMENTS.FIXED_DEPOSIT;
      const accountsEndpoint = API_CONFIG.ACCOUNTS.GET_ALL;
      
      if (investmentEndpoint.startsWith('/api/v1')) {
        results.errors.push('Potential path duplication: BASE_URL already contains "/api/v1" and investment endpoint also starts with "/api/v1"');
      }
      
      if (accountsEndpoint.startsWith('/api/v1')) {
        results.errors.push('Potential path duplication: BASE_URL already contains "/api/v1" and accounts endpoint also starts with "/api/v1"');
      }
    }
    
    console.log('All API endpoints diagnostic results:', results);
    return results;
  },

  /**
   * Test different API endpoint variations to find the correct one
   */
  testEndpointVariations: async () => {
    const results = {
      baseUrl: API_CONFIG.BASE_URL,
      variations: [],
      success: false,
      errors: []
    };
    
    try {
      // Get auth token
      const token = localStorage.getItem(APP_CONFIG.TOKEN_KEY);
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      // Test different endpoint variations for fixed deposits
      const baseUrl = 'http://localhost:8080';
      const variations = [
        { path: '/api/v1/investments/fixed-deposits', description: 'Plural with api/v1 prefix' },
        { path: '/api/v1/investments/fixed-deposit', description: 'Singular with api/v1 prefix' },
        { path: '/investments/fixed-deposits', description: 'Plural without api/v1 prefix' },
        { path: '/investments/fixed-deposit', description: 'Singular without api/v1 prefix' },
        { path: '/api/investments/fixed-deposits', description: 'Plural with api prefix' },
        { path: '/api/investments/fixed-deposit', description: 'Singular with api prefix' }
      ];
      
      // Test each variation
      for (const variation of variations) {
        const testResult = {
          url: baseUrl + variation.path,
          description: variation.description,
          success: false,
          status: null,
          contentType: null,
          isHtml: false,
          isJson: false
        };
        
        try {
          console.log(`Testing endpoint variation: ${testResult.url}`);
          const response = await fetch(testResult.url, { 
            headers,
            method: 'GET'
          });
          
          testResult.status = response.status;
          testResult.contentType = response.headers.get('content-type');
          testResult.isHtml = testResult.contentType?.includes('text/html');
          testResult.isJson = testResult.contentType?.includes('application/json');
          testResult.success = response.ok;
          
          if (testResult.success) {
            results.success = true;
          }
        } catch (err) {
          testResult.error = err.message;
        }
        
        results.variations.push(testResult);
      }
      
      console.log('API endpoint variation test results:', results);
      return results;
    } catch (err) {
      console.error('Error testing endpoint variations:', err);
      results.errors.push(`General error: ${err.message}`);
      return results;
    }
  }
};

export default apiDiagnostic; 