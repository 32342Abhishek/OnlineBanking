import axiosInstance from './axiosInstance';
import { authService } from '.';
import { API_CONFIG } from '../config';

const investmentService = {
  // Fixed Deposits
  createFixedDeposit: async (depositData) => {
    try {
      authService.checkAuth();
      console.log('Creating fixed deposit:', depositData);
      
      // Debug logging for API endpoint
      const endpoint = API_CONFIG.INVESTMENTS.FIXED_DEPOSIT;
      console.log('Fixed deposit API endpoint:', endpoint);
      console.log('Full API URL:', API_CONFIG.BASE_URL + endpoint);
      
      // Make sure we don't have "/api/v1" in both the base URL and the endpoint
      const fixedEndpoint = endpoint.startsWith('/api/v1') ? 
        endpoint.substring(7) : endpoint;
      
      // Add additional debugging for the request
      console.log('Sending fixed deposit creation request to:', API_CONFIG.BASE_URL + fixedEndpoint);
      console.log('With data:', JSON.stringify(depositData, null, 2));
      
      const response = await axiosInstance.post(fixedEndpoint, depositData);
      console.log('Fixed deposit created successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating fixed deposit:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        contentType: error.response?.headers?.['content-type']
      });
      
      // Check if this is a static resource error (HTML response instead of JSON)
      if (error.response?.headers?.['content-type']?.includes('text/html')) {
        console.error('Received HTML response instead of JSON - this indicates a wrong API path');
        throw new Error('API endpoint not found. Please check the server configuration.');
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Failed to create fixed deposit. Please try again.');
    }
  },

  getAllFixedDeposits: async (page = 0, size = 10) => {
    try {
      authService.checkAuth();
      console.log('Fetching all fixed deposits');
      
      // Make sure we don't have "/api/v1" in both the base URL and the endpoint
      const endpoint = API_CONFIG.INVESTMENTS.FIXED_DEPOSIT;
      const fixedEndpoint = endpoint.startsWith('/api/v1') ? 
        endpoint.substring(7) : endpoint;
      
      console.log('Using normalized endpoint for fixed deposits:', fixedEndpoint);
      
      const response = await axiosInstance.get(`${fixedEndpoint}?page=${page}&size=${size}`);
      console.log('Fixed deposits fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching fixed deposits:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        contentType: error.response?.headers?.['content-type']
      });
      
      // Check if this is a static resource error (HTML response instead of JSON)
      if (error.response?.headers?.['content-type']?.includes('text/html')) {
        console.error('Received HTML response instead of JSON - this indicates a wrong API path');
        throw new Error('API endpoint not found. Please check the server configuration.');
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch fixed deposits. Please try again.');
    }
  },

  getFixedDepositById: async (depositId) => {
    try {
      authService.checkAuth();
      console.log(`Fetching fixed deposit with ID: ${depositId}`);
      
      // Make sure we don't have "/api/v1" in both the base URL and the endpoint
      const endpoint = API_CONFIG.INVESTMENTS.FIXED_DEPOSIT;
      const fixedEndpoint = endpoint.startsWith('/api/v1') ? 
        endpoint.substring(7) : endpoint;
      
      const response = await axiosInstance.get(`${fixedEndpoint}/${depositId}`);
      console.log('Fixed deposit fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching fixed deposit by ID:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch fixed deposit details. Please try again.');
    }
  },

  // Recurring Deposits
  createRecurringDeposit: async (depositData) => {
    try {
      authService.checkAuth();
      console.log('Creating recurring deposit:', depositData);
      const response = await axiosInstance.post(API_CONFIG.INVESTMENTS.RECURRING_DEPOSIT, depositData);
      console.log('Recurring deposit created successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating recurring deposit:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to create recurring deposit. Please try again.');
    }
  },

  getAllRecurringDeposits: async (page = 0, size = 10) => {
    try {
      authService.checkAuth();
      console.log('Fetching all recurring deposits');
      const response = await axiosInstance.get(`${API_CONFIG.INVESTMENTS.RECURRING_DEPOSIT}?page=${page}&size=${size}`);
      console.log('Recurring deposits fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching recurring deposits:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch recurring deposits. Please try again.');
    }
  },

  getRecurringDepositById: async (depositId) => {
    try {
      authService.checkAuth();
      console.log(`Fetching recurring deposit with ID: ${depositId}`);
      const response = await axiosInstance.get(`${API_CONFIG.INVESTMENTS.RECURRING_DEPOSIT}/${depositId}`);
      console.log('Recurring deposit fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching recurring deposit by ID:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch recurring deposit details. Please try again.');
    }
  },

  // Mutual Funds
  investInMutualFund: async (investmentData) => {
    try {
      authService.checkAuth();
      console.log('Investing in mutual fund:', investmentData);
      const response = await axiosInstance.post(API_CONFIG.INVESTMENTS.MUTUAL_FUNDS, investmentData);
      console.log('Mutual fund investment successful:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error investing in mutual fund:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to invest in mutual fund. Please try again.');
    }
  },

  getAllMutualFundInvestments: async (page = 0, size = 10) => {
    try {
      authService.checkAuth();
      console.log('Fetching all mutual fund investments');
      const response = await axiosInstance.get(`${API_CONFIG.INVESTMENTS.MUTUAL_FUNDS}?page=${page}&size=${size}`);
      console.log('Mutual fund investments fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching mutual fund investments:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch mutual fund investments. Please try again.');
    }
  },

  getMutualFundInvestmentById: async (investmentId) => {
    try {
      authService.checkAuth();
      console.log(`Fetching mutual fund investment with ID: ${investmentId}`);
      const url = API_CONFIG.INVESTMENTS.GET_INVESTMENT_DETAILS.replace('{id}', investmentId);
      const response = await axiosInstance.get(url);
      console.log('Mutual fund investment fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching mutual fund investment by ID:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch mutual fund investment details. Please try again.');
    }
  },

  // Investment Rates
  getFixedDepositRates: async () => {
    try {
      console.log('Fetching fixed deposit rates');
      
      // Make sure we don't have "/api/v1" in both the base URL and the endpoint
      const endpoint = API_CONFIG.INVESTMENTS.GET_FD_RATES;
      const fixedEndpoint = endpoint.startsWith('/api/v1') ? 
        endpoint.substring(7) : endpoint;
      
      console.log('Using normalized endpoint for FD rates:', fixedEndpoint);
      console.log('Full API URL:', API_CONFIG.BASE_URL + fixedEndpoint);
      
      const response = await axiosInstance.get(fixedEndpoint);
      console.log('Fixed deposit rates fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching fixed deposit rates:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        contentType: error.response?.headers?.['content-type']
      });
      
      // Check if this is a static resource error (HTML response instead of JSON)
      if (error.response?.headers?.['content-type']?.includes('text/html')) {
        console.error('Received HTML response instead of JSON - this indicates a wrong API path');
        // Try to provide a mock response for development
        console.log('Returning mock FD rates as fallback');
        return [
          { tenureMonths: 1, regularRate: 5.00, seniorCitizenRate: 5.50 },
          { tenureMonths: 3, regularRate: 5.50, seniorCitizenRate: 6.00 },
          { tenureMonths: 6, regularRate: 6.00, seniorCitizenRate: 6.50 },
          { tenureMonths: 12, regularRate: 6.50, seniorCitizenRate: 7.00 },
          { tenureMonths: 24, regularRate: 6.75, seniorCitizenRate: 7.25 },
          { tenureMonths: 36, regularRate: 7.00, seniorCitizenRate: 7.50 }
        ];
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch fixed deposit rates. Please try again.');
    }
  },

  getRecurringDepositRates: async () => {
    try {
      console.log('Fetching recurring deposit rates');
      const response = await axiosInstance.get(API_CONFIG.INVESTMENTS.GET_RD_RATES);
      console.log('Recurring deposit rates fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching recurring deposit rates:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch recurring deposit rates. Please try again.');
    }
  },

  getAvailableMutualFunds: async () => {
    try {
      console.log('Fetching available mutual funds');
      const response = await axiosInstance.get(API_CONFIG.INVESTMENTS.GET_MUTUAL_FUNDS);
      console.log('Available mutual funds fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching available mutual funds:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch available mutual funds. Please try again.');
    }
  }
};

export default investmentService; 