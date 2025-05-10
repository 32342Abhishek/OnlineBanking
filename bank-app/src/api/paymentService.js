import axiosInstance from './axiosInstance';
import { authService } from '.';
import { API_CONFIG } from '../config';

const paymentService = {
  // Bill Payments
  payBill: async (paymentData) => {
    try {
      authService.checkAuth();
      console.log('Making bill payment:', paymentData);
      const response = await axiosInstance.post(API_CONFIG.PAYMENTS.BILL_PAYMENT, paymentData);
      console.log('Bill payment successful:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error making bill payment:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to make bill payment. Please try again.');
    }
  },

  getBillPaymentHistory: async (page = 0, size = 10) => {
    try {
      authService.checkAuth();
      console.log('Fetching bill payment history');
      const response = await axiosInstance.get(`${API_CONFIG.PAYMENTS.BILL_PAYMENT}/history?page=${page}&size=${size}`);
      console.log('Bill payment history fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching bill payment history:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch bill payment history. Please try again.');
    }
  },

  getBillPaymentById: async (paymentId) => {
    try {
      authService.checkAuth();
      console.log(`Fetching bill payment with ID: ${paymentId}`);
      const response = await axiosInstance.get(`${API_CONFIG.PAYMENTS.BILL_PAYMENT}/${paymentId}`);
      console.log('Bill payment fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching bill payment by ID:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch bill payment details. Please try again.');
    }
  },

  // Mobile Recharge
  mobileRecharge: async (rechargeData) => {
    try {
      authService.checkAuth();
      console.log('Making mobile recharge:', rechargeData);
      const response = await axiosInstance.post(API_CONFIG.PAYMENTS.MOBILE_RECHARGE, rechargeData);
      console.log('Mobile recharge successful:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error making mobile recharge:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to complete mobile recharge. Please try again.');
    }
  },

  getMobileRechargeHistory: async (page = 0, size = 10) => {
    try {
      authService.checkAuth();
      console.log('Fetching mobile recharge history');
      const response = await axiosInstance.get(`${API_CONFIG.PAYMENTS.MOBILE_RECHARGE}/history?page=${page}&size=${size}`);
      console.log('Mobile recharge history fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching mobile recharge history:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch mobile recharge history. Please try again.');
    }
  },

  // DTH Recharge
  dthRecharge: async (rechargeData) => {
    try {
      authService.checkAuth();
      console.log('Making DTH recharge:', rechargeData);
      const response = await axiosInstance.post(API_CONFIG.PAYMENTS.DTH_RECHARGE, rechargeData);
      console.log('DTH recharge successful:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error making DTH recharge:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to complete DTH recharge. Please try again.');
    }
  },

  // Utility Payments
  payUtilityBill: async (paymentData) => {
    try {
      authService.checkAuth();
      console.log('Making utility payment:', paymentData);
      const response = await axiosInstance.post(API_CONFIG.PAYMENTS.UTILITY_PAYMENT, paymentData);
      console.log('Utility payment successful:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error making utility payment:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to make utility payment. Please try again.');
    }
  },

  getUtilityPaymentHistory: async (page = 0, size = 10) => {
    try {
      authService.checkAuth();
      console.log('Fetching utility payment history');
      const response = await axiosInstance.get(`${API_CONFIG.PAYMENTS.UTILITY_PAYMENT}/history?page=${page}&size=${size}`);
      console.log('Utility payment history fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching utility payment history:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch utility payment history. Please try again.');
    }
  },

  // Billers
  getAllBillers: async () => {
    try {
      console.log('Fetching all billers');
      const response = await axiosInstance.get(API_CONFIG.PAYMENTS.GET_BILLERS);
      console.log('All billers fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching all billers:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch billers. Please try again.');
    }
  },

  getBillersByType: async (type) => {
    try {
      console.log(`Fetching billers of type: ${type}`);
      const url = API_CONFIG.PAYMENTS.GET_BILLERS_BY_TYPE.replace('{type}', type);
      const response = await axiosInstance.get(url);
      console.log('Billers fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching billers by type:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch billers. Please try again.');
    }
  }
};

export default paymentService; 