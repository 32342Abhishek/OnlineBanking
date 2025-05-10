import axios from 'axios';
import { API_CONFIG } from '../config';

/**
 * Utility for diagnosing registration API issues
 */
const registerDiagnostic = {
  /**
   * Test the registration endpoint with various configurations
   */
  testRegistrationEndpoint: async () => {
    console.log('Testing registration endpoint...');
    const results = {
      baseUrl: API_CONFIG.BASE_URL,
      endpoints: [],
      success: false,
      errors: []
    };

    // Test data for registration
    const testData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test' + Date.now() + '@example.com',
      password: 'TestPass123',
      phoneNumber: '9876543210',
      address: 'Test Address'
    };

    // Test different endpoint variations
    const endpointVariations = [
      {
        url: API_CONFIG.BASE_URL + '/api/v1/auth/register',
        description: 'Standard path with /api/v1 prefix'
      },
      {
        url: API_CONFIG.BASE_URL + '/auth/register',
        description: 'Path without /api/v1 prefix'
      },
      {
        url: 'http://localhost:8080/api/v1/auth/register',
        description: 'Direct localhost:8080 with /api/v1 prefix'
      },
      {
        url: 'http://localhost:8080/auth/register',
        description: 'Direct localhost:8080 without /api/v1 prefix'
      }
    ];

    // Test each endpoint variation
    for (const endpoint of endpointVariations) {
      try {
        console.log(`Testing endpoint: ${endpoint.url}`);
        
        // Make a preflight OPTIONS request to check CORS
        const optionsResponse = await fetch(endpoint.url, {
          method: 'OPTIONS',
          headers: {
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'content-type,authorization',
            'Origin': window.location.origin
          }
        }).catch(err => ({ ok: false, error: err.message }));
        
        const corsStatus = optionsResponse.ok ? 'CORS Allowed' : 'CORS Blocked';
        
        // Try the actual POST request
        const response = await axios({
          method: 'post',
          url: endpoint.url,
          data: testData,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 5000
        }).catch(err => {
          // Capture error details but don't throw
          return {
            error: err,
            status: err.response?.status,
            statusText: err.response?.statusText,
            data: err.response?.data
          };
        });

        // Process the result
        const result = {
          url: endpoint.url,
          description: endpoint.description,
          corsStatus,
          status: response.status || response.error?.response?.status,
          statusText: response.statusText || response.error?.response?.statusText,
          success: !response.error,
          error: response.error ? 
            (response.error.response?.data?.message || response.error.message) : 
            null,
          data: response.data
        };

        results.endpoints.push(result);
        
        // If this endpoint worked, mark overall success
        if (!response.error) {
          results.success = true;
        }
      } catch (err) {
        results.endpoints.push({
          url: endpoint.url,
          description: endpoint.description,
          success: false,
          error: err.message
        });
        results.errors.push(`Error testing ${endpoint.url}: ${err.message}`);
      }
    }

    console.log('Registration endpoint test results:', results);
    return results;
  },

  /**
   * Run a comprehensive check of registration functionality
   */
  runFullDiagnostic: async () => {
    const results = {
      apiConfig: API_CONFIG.AUTH.REGISTER,
      baseUrl: API_CONFIG.BASE_URL,
      fullUrl: API_CONFIG.BASE_URL + API_CONFIG.AUTH.REGISTER,
      endpointTests: await registerDiagnostic.testRegistrationEndpoint(),
      corsStatus: 'Unknown',
      serverStatus: 'Unknown'
    };

    // Test server availability
    try {
      await axios.get(API_CONFIG.BASE_URL + '/api/v1/health').catch(err => {
        // Try without /api/v1
        return axios.get(API_CONFIG.BASE_URL + '/health');
      });
      results.serverStatus = 'Online';
    } catch (err) {
      results.serverStatus = 'Offline or Unreachable';
    }

    // Provide recommendations based on results
    if (results.endpointTests.success) {
      results.recommendation = 'Found a working endpoint configuration. Update your config.js to use this endpoint.';
      
      // Find the working endpoint
      const workingEndpoint = results.endpointTests.endpoints.find(e => e.success);
      if (workingEndpoint) {
        results.workingEndpoint = workingEndpoint.url;
      }
    } else {
      results.recommendation = 'No working endpoint found. Check server status and CORS configuration.';
    }

    return results;
  }
};

export default registerDiagnostic; 