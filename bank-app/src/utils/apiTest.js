import axiosInstance from '../api/axiosInstance';
import { API_CONFIG } from '../config';
import { authService } from '../api';

/**
 * Utility for testing API configuration and connections
 */
const apiTest = {
  /**
   * Test API base URL configuration
   */
  testApiConfig: () => {
    console.log('Testing API configuration:');
    console.log('BASE_URL:', API_CONFIG.BASE_URL);
    
    // Check if the environment is correctly configured
    const env = process.env.NODE_ENV || 'development';
    console.log('Current environment:', env);
    
    // Check if the base URL is correctly configured without /api/v1 duplication
    const hasApiV1Duplication = API_CONFIG.BASE_URL.includes('/api/v1') && 
                              Object.values(API_CONFIG.AUTH).some(path => path.includes('/api/v1'));
    
    console.log('API path duplication issue:', hasApiV1Duplication ? 'YES - PROBLEM DETECTED' : 'No - configuration is correct');
    
    // Sample endpoints to check
    const sampleEndpoints = {
      'Auth Login': API_CONFIG.BASE_URL + API_CONFIG.AUTH.LOGIN,
      'Accounts List': API_CONFIG.BASE_URL + API_CONFIG.ACCOUNTS.GET_ALL,
      'Create Account': API_CONFIG.BASE_URL + API_CONFIG.ACCOUNTS.CREATE,
      'Health Check': API_CONFIG.BASE_URL + '/health'
    };
    
    console.log('Sample full endpoints:');
    Object.entries(sampleEndpoints).forEach(([name, url]) => {
      console.log(`- ${name}: ${url}`);
    });
    
    return {
      baseUrl: API_CONFIG.BASE_URL,
      environment: env,
      hasDuplicationIssue: hasApiV1Duplication,
      sampleEndpoints
    };
  },
  
  /**
   * Test backend health endpoint
   */
  testHealth: async () => {
    try {
      console.log('Testing health endpoint...');
      
      // Test with axiosInstance
      console.log('Using axios instance with base URL:', API_CONFIG.BASE_URL);
      const axiosResponse = await axiosInstance.get('/health');
      console.log('Axios health response:', axiosResponse.data);
      
      // Test with direct fetch to full URL
      console.log('Using fetch with full URL:', API_CONFIG.BASE_URL + '/health');
      const fetchResponse = await fetch(API_CONFIG.BASE_URL + '/health');
      const fetchData = await fetchResponse.json();
      console.log('Fetch health response:', fetchData);
      
      // Test with Spring Boot convention (remove /api/v1 duplicate)
      console.log('Using fetch with Spring convention:', 'http://localhost:8080/api/v1/health');
      const springResponse = await fetch('http://localhost:8080/api/v1/health');
      const springData = await springResponse.json();
      console.log('Spring convention response:', springData);
      
      return {
        success: true,
        axiosResponse: axiosResponse.data,
        fetchResponse: fetchData,
        springResponse: springData
      };
    } catch (error) {
      console.error('Health endpoint test failed:', error);
      return {
        success: false,
        error: error.message,
        details: {
          axios: error.response?.data,
          code: error.code,
          status: error.response?.status
        }
      };
    }
  },
  
  /**
   * Attempt to login with test credentials
   */
  testLogin: async (username = 'test@example.com', password = 'password123') => {
    try {
      console.log(`Testing login with username: ${username}`);
      
      // First check if we're already logged in
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        console.log('Already logged in as:', currentUser);
        return {
          success: true,
          message: 'Already logged in',
          user: currentUser
        };
      }
      
      // Try to login
      const loginData = { username, password };
      const response = await axiosInstance.post(API_CONFIG.AUTH.LOGIN, loginData);
      console.log('Login response:', response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Login test failed:', error);
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }
  },
  
  /**
   * Fix common API configuration issues
   */
  fixCommonIssues: () => {
    console.log('Attempting to fix common API configuration issues...');
    
    // Check if BASE_URL has /api/v1 suffix but endpoints also include it
    if (API_CONFIG.BASE_URL.endsWith('/api/v1')) {
      console.log('ISSUE: API_BASE_URL ends with /api/v1 which may cause path duplication');
      console.log('SUGGESTION: Update API_BASE_URL to remove the /api/v1 suffix in config.js');
      
      // Return detailed instructions
      return {
        hasDuplicationIssue: true,
        suggestion: 'Edit config.js to remove /api/v1 from API_BASE_URL or remove it from all endpoint paths'
      };
    }
    
    // If no issues detected
    return {
      hasDuplicationIssue: false,
      suggestion: 'No common issues detected in API configuration'
    };
  },
  
  /**
   * Test Spring Boot API path conventions
   */
  testSpringBootPaths: async () => {
    console.log('Testing Spring Boot API path conventions...');
    
    const results = {
      directPath: { success: false, data: null, error: null },
      apiV1Path: { success: false, data: null, error: null }
    };
    
    // Test direct accounts path
    try {
      console.log('Testing direct accounts path:', API_CONFIG.BASE_URL + '/accounts');
      const directResponse = await fetch(API_CONFIG.BASE_URL + '/accounts', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (directResponse.ok) {
        const data = await directResponse.json();
        results.directPath = { success: true, data, status: directResponse.status };
      } else {
        results.directPath = { 
          success: false, 
          error: 'Direct path returned ' + directResponse.status,
          status: directResponse.status
        };
      }
    } catch (error) {
      results.directPath = { success: false, error: error.message };
    }
    
    // Test with Spring Boot API v1 convention
    try {
      console.log('Testing Spring convention path:', API_CONFIG.BASE_URL + '/api/v1/accounts');
      const springResponse = await fetch(API_CONFIG.BASE_URL + '/api/v1/accounts', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (springResponse.ok) {
        const data = await springResponse.json();
        results.apiV1Path = { success: true, data, status: springResponse.status };
      } else {
        results.apiV1Path = { 
          success: false, 
          error: 'API v1 path returned ' + springResponse.status,
          status: springResponse.status
        };
      }
    } catch (error) {
      results.apiV1Path = { success: false, error: error.message };
    }
    
    // Determine which path convention is working
    let recommendation = '';
    if (results.directPath.success && !results.apiV1Path.success) {
      recommendation = 'Backend is using direct paths without /api/v1 prefix. Keep the current configuration.';
    } else if (!results.directPath.success && results.apiV1Path.success) {
      recommendation = 'Backend is using /api/v1 prefix convention. Add this prefix to the base URL in config.js.';
    } else if (results.directPath.success && results.apiV1Path.success) {
      recommendation = 'Both path conventions work! This is unusual but technically valid.';
    } else {
      recommendation = 'Neither path convention worked. Check if the server is running and endpoints are correctly exposed.';
    }
    
    return {
      ...results,
      recommendation
    };
  }
};

export default apiTest; 