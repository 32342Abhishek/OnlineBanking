import axiosInstance from './axiosInstance';
import { authService } from '.';
import { API_CONFIG } from '../config';
import { APP_CONFIG } from '../config';

const transactionService = {
  // Get user accounts
  getUserAccounts: async () => {
    try {
      // Check authentication first
      const token = localStorage.getItem(APP_CONFIG.TOKEN_KEY);
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      console.log('Fetching accounts with token:', token.substring(0, 20) + '...');
      
      // Make the API call with explicit headers
      const response = await axiosInstance.get(API_CONFIG.ACCOUNTS.GET_ALL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Handle Spring Boot response structure
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching user accounts:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
        headers: error.response?.headers,
        url: error.config?.url
      });

      if (error.response?.status === 403) {
        // Check if token is present but invalid
        const token = localStorage.getItem(APP_CONFIG.TOKEN_KEY);
        if (token) {
          throw new Error('Your session may have expired. Please try logging in again.');
        } else {
          throw new Error('You need to log in to view accounts.');
        }
      }

      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch accounts');
    }
  },

  // Regular fund transfers
  transferFunds: async (transferData) => {
    try {
      authService.checkAuth();
      console.log('Initiating bank transfer:', transferData);
      const response = await axiosInstance.post(API_CONFIG.TRANSACTIONS.TRANSFER, transferData);
      console.log('Transfer successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Transfer error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || 'Failed to complete transfer');
    }
  },

  // Instant transfers (IMPS/NEFT)
  instantTransfer: async (transferData) => {
    try {
      authService.checkAuth();
      console.log('Initiating instant transfer:', transferData);
      
      // Validate transfer limits based on type
      const limits = API_CONFIG.TRANSACTION_LIMITS[transferData.transferType];
      const amount = parseFloat(transferData.amount);
      
      if (amount < limits.MIN || amount > limits.MAX) {
        throw new Error(`Amount should be between ${limits.MIN} and ${limits.MAX}`);
      }

      const response = await axiosInstance.post(
        `${API_CONFIG.TRANSACTIONS.TRANSFER}/instant`,
        transferData
      );
      
      console.log('Instant transfer successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Instant transfer error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to complete instant transfer');
    }
  },

  // International transfers
  internationalTransfer: async (transferData) => {
    try {
      authService.checkAuth();
      console.log('Initiating international transfer:', transferData);
      
      // Additional validation for international transfers
      if (!transferData.swiftCode || !transferData.iban) {
        throw new Error('SWIFT code and IBAN are required for international transfers');
      }

      const response = await axiosInstance.post(
        `${API_CONFIG.TRANSACTIONS.TRANSFER}/international`,
        transferData
      );
      
      console.log('International transfer initiated:', response.data);
      return response.data;
    } catch (error) {
      console.error('International transfer error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to initiate international transfer');
    }
  },

  // Scheduled transfers
  scheduleTransfer: async (transferData) => {
    try {
      authService.checkAuth();
      console.log('Scheduling transfer:', transferData);
      
      if (!transferData.scheduledDate) {
        throw new Error('Scheduled date is required');
      }

      const response = await axiosInstance.post(
        `${API_CONFIG.TRANSACTIONS.TRANSFER}/scheduled`,
        transferData
      );
      
      console.log('Transfer scheduled successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Scheduled transfer error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to schedule transfer');
    }
  },

  // Get transfer history
  getTransferHistory: async (params = {}) => {
    try {
      authService.checkAuth();
      console.log('Fetching transfer history:', params);
      
      const response = await axiosInstance.get(API_CONFIG.TRANSACTIONS.GET_BY_ACCOUNT, {
        params: {
          ...params,
          type: 'TRANSFER'
        }
      });
      
      console.log('Transfer history fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching transfer history:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || 'Failed to fetch transfer history');
    }
  },

  // Get transfer details
  getTransferDetails: async (transferId) => {
    try {
      authService.checkAuth();
      console.log('Fetching transfer details:', transferId);
      
      const response = await axiosInstance.get(
        `${API_CONFIG.TRANSACTIONS.GET_BY_ID}/${transferId}`
      );
      
      console.log('Transfer details fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching transfer details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || 'Failed to fetch transfer details');
    }
  },

  // Download transfer receipt
  downloadTransferReceipt: async (transferId) => {
    try {
      authService.checkAuth();
      console.log('Downloading transfer receipt:', transferId);
      
      const response = await axiosInstance.get(
        `${API_CONFIG.TRANSACTIONS.GET_BY_ID}/${transferId}/receipt`,
        {
          responseType: 'blob'
        }
      );
      
      console.log('Receipt downloaded successfully');
      return response.data;
    } catch (error) {
      console.error('Error downloading receipt:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || 'Failed to download receipt');
    }
  },

  // Get scheduled transfers
  getScheduledTransfers: async () => {
    try {
      authService.checkAuth();
      console.log('Fetching scheduled transfers');
      const response = await axiosInstance.get(`${API_CONFIG.TRANSACTIONS.TRANSFER}/scheduled`);
      console.log('Scheduled transfers fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching scheduled transfers:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch scheduled transfers. Please try again.');
    }
  },

  // Cancel scheduled transfer
  cancelScheduledTransfer: async (scheduledTransferId) => {
    try {
      authService.checkAuth();
      console.log(`Cancelling scheduled transfer with ID: ${scheduledTransferId}`);
      const response = await axiosInstance.delete(`${API_CONFIG.TRANSACTIONS.TRANSFER}/scheduled/${scheduledTransferId}`);
      console.log('Scheduled transfer cancelled successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error cancelling scheduled transfer:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to cancel scheduled transfer. Please try again.');
    }
  },

  // Get transaction by ID
  getTransactionById: async (transactionId) => {
    try {
      authService.checkAuth();
      console.log(`Fetching transaction with ID: ${transactionId}`);
      const url = API_CONFIG.TRANSACTIONS.GET_BY_ID.replace('{id}', transactionId);
      const response = await axiosInstance.get(url);
      console.log('Transaction fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching transaction:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch transaction details. Please try again.');
    }
  },

  // Get account transactions with pagination
  getAccountTransactions: async (accountId, page = 0, size = 10) => {
    try {
      authService.checkAuth();
      console.log(`Fetching transactions for account ${accountId}, page ${page}`);
      const url = API_CONFIG.TRANSACTIONS.GET_BY_ACCOUNT.replace('{accountId}', accountId);
      const response = await axiosInstance.get(`${url}?page=${page}&size=${size}`);
      console.log('Transactions fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching transactions:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch transactions. Please try again.');
    }
  },

  // Get account transactions by date range
  getTransactionsByDateRange: async (accountId, startDate, endDate, page = 0, size = 10) => {
    try {
      authService.checkAuth();
      // Format dates using helper
      const formattedStartDate = authService.formatDateForBackend(startDate);
      const formattedEndDate = authService.formatDateForBackend(endDate);
      
      console.log(`Fetching transactions by date range for account ${accountId}`);
      const url = API_CONFIG.TRANSACTIONS.GET_BY_ACCOUNT.replace('{accountId}', accountId);
      const response = await axiosInstance.get(
        `${url}/date-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}&page=${page}&size=${size}`
      );
      console.log('Transactions by date range fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching transactions by date range:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch transactions by date range. Please try again.');
    }
  },

  // Get account statement
  getAccountStatement: async (accountId, startDate, endDate, format = 'PDF') => {
    try {
      authService.checkAuth();
      // Format dates using helper
      const formattedStartDate = authService.formatDateForBackend(startDate);
      const formattedEndDate = authService.formatDateForBackend(endDate);
      
      console.log(`Generating account statement for account ${accountId}`);
      const response = await axiosInstance.get(
        `${API_CONFIG.TRANSACTIONS.GET_STATEMENT}?accountId=${accountId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}&format=${format}`,
        { responseType: format.toLowerCase() === 'pdf' ? 'blob' : 'json' }
      );
      
      console.log('Account statement generated successfully');
      
      // Handle different response types
      if (format.toLowerCase() === 'pdf') {
        // Return blob for PDF
        return {
          data: response.data,
          filename: `account_statement_${accountId}_${formattedStartDate.split('T')[0]}_${formattedEndDate.split('T')[0]}.pdf`,
          contentType: 'application/pdf'
        };
      } else {
        // Return JSON data
        return response.data.data || response.data;
      }
    } catch (error) {
      console.error('Error generating account statement:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to generate account statement. Please try again.');
    }
  }
};

export default transactionService; 