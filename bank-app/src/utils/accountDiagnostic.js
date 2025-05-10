import axiosInstance from '../api/axiosInstance';
import { API_CONFIG } from '../config';
import { authService } from '../api';
import accountService from '../api/accountService';

/**
 * Utility for diagnosing and resolving account creation issues
 */
const accountDiagnostic = {
  /**
   * Run a full diagnostic on account creation functionality
   * @returns {Promise<Object>} Diagnostic results
   */
  runDiagnostic: async () => {
    console.log('Starting account creation diagnostic...');
    const results = {
      server: await accountDiagnostic.checkServerConnection(),
      auth: await accountDiagnostic.checkAuthentication(),
      endpoint: await accountDiagnostic.checkAccountEndpoint(),
      cors: await accountDiagnostic.checkCorsConfig(),
      retry: await accountDiagnostic.attemptAccountCreation()
    };
    
    console.log('Diagnostic complete. Results:', results);
    
    // Overall assessment
    if (results.server.success && results.auth.success && results.endpoint.success) {
      results.assessment = "Server, authentication, and endpoints appear to be working. The issue may be with the data being sent or specific API requirements.";
    } else if (!results.server.success) {
      results.assessment = "Backend server connection issue. Verify the server is running and accessible.";
    } else if (!results.auth.success) {
      results.assessment = "Authentication issue. Try logging in again.";
    } else if (!results.endpoint.success) {
      results.assessment = "Account endpoint issue. Check that the API path is correct and the server is configured properly.";
    } else if (!results.cors.success) {
      results.assessment = "CORS configuration issue. Check backend CORS settings.";
    }
    
    return results;
  },
  
  /**
   * Check if server is reachable
   * @returns {Promise<Object>} Server connection status
   */
  checkServerConnection: async () => {
    try {
      console.log('Checking server connection...');
      const response = await axiosInstance.testConnection();
      console.log('Server connection test:', response);
      return response;
    } catch (error) {
      console.error('Server connection test failed:', error);
      return {
        success: false,
        error: error.message,
        remedy: 'Ensure the backend server is running at ' + API_CONFIG.BASE_URL
      };
    }
  },
  
  /**
   * Check if authentication is working
   * @returns {Promise<Object>} Authentication status
   */
  checkAuthentication: async () => {
    try {
      console.log('Checking authentication...');
      const token = authService.getToken();
      
      if (!token) {
        return {
          success: false,
          error: 'No authentication token found',
          remedy: 'Please log in again to get a valid token'
        };
      }
      
      // Try to access a protected endpoint
      const response = await axiosInstance.get(API_CONFIG.ACCOUNTS.GET_ALL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      return {
        success: true,
        message: 'Authentication is working properly',
        data: response.data
      };
    } catch (error) {
      console.error('Authentication test failed:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Authentication token is invalid or expired',
          remedy: 'Please log in again to get a fresh token'
        };
      }
      
      return {
        success: false,
        error: error.message,
        remedy: 'Check authentication configuration'
      };
    }
  },
  
  /**
   * Check if account endpoint is accessible and properly configured
   * @returns {Promise<Object>} Endpoint status
   */
  checkAccountEndpoint: async () => {
    try {
      console.log('Checking account endpoint...');
      return await accountService.testAccountEndpoint();
    } catch (error) {
      console.error('Account endpoint test failed:', error);
      return {
        success: false,
        error: error.message,
        remedy: 'Check that the account API endpoints are correctly configured'
      };
    }
  },
  
  /**
   * Check CORS configuration
   * @returns {Promise<Object>} CORS configuration status
   */
  checkCorsConfig: async () => {
    try {
      console.log('Checking CORS configuration...');
      
      // Try sending an OPTIONS request to check CORS headers
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/accounts`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type, Authorization'
        }
      });
      
      const corsHeaders = {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
        'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials')
      };
      
      // Check if the necessary CORS headers are present
      const hasRequiredHeaders = corsHeaders['Access-Control-Allow-Origin'] && 
                                corsHeaders['Access-Control-Allow-Methods'];
      
      return {
        success: hasRequiredHeaders,
        corsHeaders,
        message: hasRequiredHeaders ? 'CORS headers appear to be configured correctly' : 'Missing required CORS headers',
        remedy: !hasRequiredHeaders ? 'Check backend CORS configuration in WebConfig.java' : null
      };
    } catch (error) {
      console.error('CORS configuration test failed:', error);
      return {
        success: false,
        error: error.message,
        remedy: 'This may indicate a CORS configuration issue. Ensure the backend has proper CORS settings.'
      };
    }
  },
  
  /**
   * Attempt to create an account with a sample data
   * @returns {Promise<Object>} Account creation test results
   */
  attemptAccountCreation: async () => {
    try {
      console.log('Testing account creation with sample data...');
      
      // Sample account data for testing
      const sampleAccountData = {
        accountType: 'SAVINGS',
        accountName: 'Test Account',
        initialDeposit: 1000,
        currency: 'INR'
      };
      
      // Try to create an account
      const response = await axiosInstance.post(API_CONFIG.ACCOUNTS.CREATE, sampleAccountData, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      
      return {
        success: true,
        message: 'Test account creation was successful',
        data: response.data
      };
    } catch (error) {
      console.error('Test account creation failed:', error);
      
      // Try to get the detailed error message
      let errorMessage = error.message;
      let errorData = null;
      
      if (error.response) {
        errorData = error.response.data;
        
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
        data: errorData,
        remedy: 'The specific error message may indicate what fields or values are incorrect or missing'
      };
    }
  },
  
  /**
   * Check which fields are required for account creation
   * @returns {Promise<Object>} Field requirements analysis
   */
  analyzeRequiredFields: async () => {
    console.log('Analyzing required fields for account creation...');
    
    // Test different field combinations to determine required fields
    const fieldTests = [
      { name: 'account type only', data: { accountType: 'SAVINGS' } },
      { name: 'with account name', data: { accountType: 'SAVINGS', accountName: 'Test Account' } },
      { name: 'with initial deposit', data: { accountType: 'SAVINGS', initialDeposit: 1000 } },
      { name: 'with currency', data: { accountType: 'SAVINGS', currency: 'INR' } },
      { name: 'full data set', data: { 
          accountType: 'SAVINGS', 
          accountName: 'Test Account', 
          initialDeposit: 1000, 
          currency: 'INR' 
      }}
    ];
    
    const results = [];
    
    for (const test of fieldTests) {
      try {
        const response = await axiosInstance.post(API_CONFIG.ACCOUNTS.CREATE, test.data, {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`,
            'Content-Type': 'application/json'
          }
        });
        
        results.push({
          test: test.name,
          success: true,
          data: response.data
        });
      } catch (error) {
        results.push({
          test: test.name,
          success: false,
          error: error.response?.data?.message || error.message
        });
      }
    }
    
    console.log('Field analysis results:', results);
    
    // Determine which fields are required based on test results
    const requiredFields = [];
    const optionalFields = [];
    
    fieldTests.forEach(test => {
      const testResult = results.find(r => r.test === test.name);
      
      // If this combination failed, the missing fields might be required
      if (!testResult.success) {
        const missingFields = Object.keys(fieldTests.find(t => t.name === 'full data set').data)
          .filter(field => !Object.keys(test.data).includes(field));
        
        missingFields.forEach(field => {
          if (!requiredFields.includes(field)) {
            requiredFields.push(field);
          }
        });
      } 
      // If this combination succeeded, the included fields might be sufficient
      else {
        Object.keys(test.data).forEach(field => {
          if (!requiredFields.includes(field) && !optionalFields.includes(field)) {
            optionalFields.push(field);
          }
        });
      }
    });
    
    return {
      required: requiredFields,
      optional: optionalFields,
      testResults: results
    };
  }
};

export default accountDiagnostic; 